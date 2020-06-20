package main

import (
	"database/sql"
	"encoding/json"
	_ "encoding/json"
	"fmt"
	"github.com/gorilla/websocket"
	_ "github.com/mattn/go-sqlite3"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"
)


/*
** JSON In https://blog.golang.org/json
** data da http in https://medium.com/@masnun/making-http-requests-in-golang-dd123379efe7
*/

var upgrader = websocket.Upgrader{
	ReadBufferSize:    4096,
	WriteBufferSize:   4096,
	EnableCompression: true,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func handler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "<h1>%s</h1><div>%s</div>", "Titolo", "Corpo")
	fmt.Fprintf(w, "Hi there, I love %s!", r.URL.Path[1:])
	p:=r.URL.Query()

	fmt.Fprintf(w, "", p.Get("prova"))
	fmt.Fprintf(w, "<br><hr>")
	fmt.Fprintf(w, "<form action='/adler' method='POST'><input type='text' name='testo' value=''><input type='submit' name='invio' value='invia'></form>")
}

func handlerIban(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	t1 := r.FormValue("codice")
	fmt.Println("Valore: ", t1)
	params := r.PostFormValue("codice") // to get params value with key

	/*ww, err := conn.NextWriter(websocket.TextMessage)
	if err != nil {
		return
	}
	ww.Write([]byte(params))
	*/
	err := conn.WriteMessage(websocket.TextMessage, []byte(params))
	if err != nil {
		log.Println("write:", err)

	}
	fmt.Println("inviato? ", params)

	q := "INSERT INTO libri(titolo,descrizione,copertina,Autore,isbn) VALUES('','','','','"+params+"')"
	_, errdb := db.Exec(q)
	fmt.Println(errdb)
}

func handlerLibriSet(w http.ResponseWriter, r *http.Request) {

	r.ParseMultipartForm(0)

	id := r.FormValue("Id")
	titolo := r.FormValue("Titolo")
	desc := r.FormValue("Desc")
	autore := r.FormValue("Autore")
	img := r.FormValue("Img")
	isbn := r.FormValue("Isbn")
	// categorie := r.FormValue("Categorie")

	var err error;
	if id!="0" {
		_, err = db.Exec("UPDATE libri SET titolo=$1, descrizione=$2, copertina=$3, Autore=$4, isbn=$5 WHERE id=$6", titolo, desc, img, autore, isbn, id);
	}else{
		res, err1 := db.Exec("INSERT INTO libri(titolo,descrizione,copertina,Autore,isbn) VALUES($1,$2,$3,$4,$5)", titolo, desc, img, autore, isbn);
		err=err1
		idd, _ := res.LastInsertId();
		fmt.Println("idd: ", idd, err)
		id = strconv.FormatInt(idd,10)
	}
	fmt.Println("err: ", err)
	fmt.Println("id: ", id, isbn)

	w.Header().Set("Access-Control-Allow-Origin", "*")
	fmt.Fprintf(w, id)

	/* fmt.Println("id", t1)
	fmt.Println("titolo", t2)
	fmt.Println("descrizione", t3)
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "*")
	fmt.Fprintf(w, "Ciao Adler %s!", "aa") */
}



func handlerLibri(w http.ResponseWriter, r *http.Request){
	r.ParseForm()
	quali := r.FormValue("quali")
	fmt.Println("quali=",quali)
	w.Header().Set("Access-Control-Allow-Origin", "*")
	if(1==0) {
		js, _ := ioutil.ReadFile("go/json.json")
		fmt.Fprintf(w, "%s", js)
	}else if quali=="vuoti" {
		righe := elencoLibri(quali)
		fmt.Fprintf(w, "[")
		for i := 0; i < len(righe); i++ {
			if(i>0){
				fmt.Fprintf(w,",")
			}
			jsn, _ := json.Marshal(righe[i])
			fmt.Fprintf(w, "%s", jsn)
		}
		fmt.Fprintf(w, "]")
	}else{
		righe := elencoLibri(quali)
		fmt.Fprintf(w, "[")
		for i := 0; i < len(righe); i++ {
			if(i>0){
				fmt.Fprintf(w,",")
			}
			jsn, _ := json.Marshal(righe[i])
			fmt.Fprintf(w, "%s", jsn)
		}
		fmt.Fprintf(w, "]")
	}
}

var conn *websocket.Conn

func handlerWS(w http.ResponseWriter, r *http.Request){
	c, _ := upgrader.Upgrade(w, r, nil)
	conn = c
	fmt.Println("connessione ws")

	mt, message, err := c.ReadMessage()
	if err != nil {
		log.Println("read:", err)

	}
	log.Printf("recv: %s", message)
	err = c.WriteMessage(mt, message)
	if err != nil {
		log.Println("write:", err)

	}
}
func salvaLibro(){

}
func elencoLibri(quali string) map[int]riga{

	righe:= make(map[int]riga)
	var (
		id int
		t string
		a string
		isbn string
	)
	q := "SELECT id, titolo, Autore, isbn FROM libri WHERE 1=1"
	if quali=="vuoti"{
		q = q + " AND titolo = ''"
	}
	fmt.Println(q)
	r, err := db.Query( q )
	fmt.Println(err)
	i:=0
	var rr riga

	for r.Next() {
		r.Scan(&id, &t, &a, &isbn)
		rr.Titolo=t
		rr.Autore=a
		rr.Id=id
		rr.Img="https://picsum.photos/300/300?"+fmt.Sprintf("%s",i)
		rr.Isbn=isbn
		fmt.Println(isbn)
		righe[i]=rr
		fmt.Println(righe[i])
		i++
	}
	return righe

}

type riga struct {
	Id int
	Titolo string
	Autore string
	Desc string
	Img string
	Isbn string
}

var db *sql.DB

/*
https://github.com/gorilla/websocket/blob/master/examples/echo/server.go
https://tutorialedge.net/typescript/angular/angular-websockets-tutorial/

https://www.googleapis.com/books/v1/volumes/i8_XngEACAAJ
https://www.googleapis.com/books/v1/volumes?q=isbn:9788815247902
 */
func main() {
	var err error
	db, err = sql.Open("sqlite3","go/mieilibri.sqlite")
	defer db.Close()
	fmt.Println("DB ", err)

	fmt.Println("ciao!!!!")
	http.HandleFunc("/", handler)
	http.HandleFunc("/libriset", handlerLibriSet)
	http.HandleFunc("/libri", handlerLibri)
	http.HandleFunc("/iban", handlerIban)
	http.HandleFunc("/ws", handlerWS)
	log.Fatal(http.ListenAndServe(":8080", nil))
}
