package main

import (
	"database/sql"
	"encoding/json"
	_ "encoding/json"
	"fmt"
	"github.com/gorilla/websocket"
	_ "github.com/mattn/go-sqlite3"
	"log"
	"net/http"
	"strconv"
	"strings"
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

func trovaCategoria(c string) int{
	q := "SELECT id FROM categorie WHERE categoria = ?"
	smtt, _ := db.Prepare(q)
	r, _ := smtt.Query(c)
	idc := 0;
	for r.Next(){
		r.Scan(&idc)
	}
	return idc;
}
func salvaCategoria(id int, cat string){
	cats := strings.Split(cat, ",");
	var idc int;

	for i:=0; i< len(cats); i++ {
		idc = trovaCategoria(cats[i]);
		if idc==0{
			res, _ := db.Exec("INSERT INTO categorie(categoria) VALUES($1)",strings.TrimSpace(cats[i]))
			idd, _ := res.LastInsertId();
			idc = int(idd)
		}
		db.Exec("INSERT INTO libricat(id_libro,id_categoria) VALUES($1,$2)",id,idc)
	}
}

func handlerLibriSet(w http.ResponseWriter, r *http.Request) {

	r.ParseMultipartForm(0)

	delID := r.FormValue("delID")
	id := r.FormValue("Id")
	titolo := r.FormValue("Titolo")
	desc := r.FormValue("Desc")
	autore := r.FormValue("Autore")
	img := r.FormValue("Img")
	isbn := r.FormValue("Isbn")
	Categorie := r.FormValue("Categorie");

	// categorie := r.FormValue("Categorie")
	fmt.Println("delID: ", delID)

	var err error;
	if delID!=""{
		_, err = db.Exec("DELETE FROM libri WHERE id=$1", delID)
		id=delID
		fmt.Println("cancellato ID: ", delID)

	}else if id!="0" {
		_, err = db.Exec("UPDATE libri SET titolo=$1, descrizione=$2, copertina=$3, Autore=$4, isbn=$5 WHERE id=$6", titolo, desc, img, autore, isbn, id);
	}else{
		res, err1 := db.Exec("INSERT INTO libri(titolo,descrizione,copertina,Autore,isbn,Categorie) VALUES($1,$2,$3,$4,$5,$6)", titolo, desc, img, autore, isbn);
		err=err1
		idd, _ := res.LastInsertId();
		fmt.Println("idd: ", idd, err)
		id = strconv.FormatInt(idd,10)
	}
	fmt.Println("err: ", err)
	fmt.Println("id: ", id, isbn)

	iid, _ := strconv.ParseInt(id, 10, 32)
	salvaCategoria(int(iid),Categorie);

	w.Header().Set("Access-Control-Allow-Origin", "*")
	fmt.Fprintf(w, id)

	/* fmt.Println("id", t1)
	fmt.Println("titolo", t2)
	fmt.Println("descrizione", t3)
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "*")
	fmt.Fprintf(w, "Ciao Adler %s!", "aa") */
}

func cercaLibri(cosa string, quale string) map[int]riga{
	righe:= make(map[int]riga)
	var (
		id int
		t string
		a string
		isbn string
		c string
		d string
	)
	q := "SELECT id, titolo, Autore, isbn, copertina, descrizione FROM libri WHERE 1=1"
	if quale=="vuoti"{
		q = q + " AND titolo = ''"
	}
	if cosa=="/libri/titolo" {
		q = q + " AND titolo LIKE '%"+quale+"%'"
	}else if cosa=="/libri/autore" {
		qq := strings.Split(quale,",");
		ii := 0
		q = q + " AND (1=0"
		for ii=0; ii< len(qq); ii++ {
			q = q + " OR autore LIKE '%" + qq[ii] + "%'"
		}
		q = q + ")"
	}
	fmt.Println(q)
	r, err := db.Query( q )
	fmt.Println(err)
	i:=0
	var rr riga

	for r.Next() {
		r.Scan(&id, &t, &a, &isbn, &c, &d)
		rr.Titolo=t
		rr.Autore=a
		rr.Id=id
		rr.Img=c
		rr.Isbn=isbn
		rr.Desc=d
		fmt.Println(isbn)
		righe[i]=rr
		fmt.Println(righe[i])
		i++
	}
	fmt.Println(righe)
	return righe
}

func handlerLibri(w http.ResponseWriter, r *http.Request){
	r.ParseForm()
	quali := r.FormValue("quali")
	h := r.URL
	p, _:=h.Parse("titolo");
	fmt.Println("host ",p, r.URL.Path);
	fmt.Println("quali=",quali)

	var righe map[int]riga;
	switch r.Method {
		case "GET":  righe = cercaLibri(r.URL.Path, quali)
	}
	w.Header().Set("Access-Control-Allow-Origin", "*")

	fmt.Fprintf(w, "[")
	for i := 0; i < len(righe); i++ {
		if(i>0){
			fmt.Fprintf(w,",")
		}
		jsn, _ := json.Marshal(righe[i])
		fmt.Fprintf(w, "%s", jsn)
	}
	fmt.Fprintf(w, "]")

	return
}

func handlerAutori(w http.ResponseWriter, r *http.Request){
	var (
		a string
	)
	q := "SELECT distinct Autore FROM libri WHERE 1=1 ORDER BY Autore"

	fmt.Println(q)
	riga, err := db.Query( q )
	fmt.Println(err)
	i:=0

	fmt.Fprintf(w, "[")

	for riga.Next() {
		for k:=0; k<1; k++ {
			riga.Scan(&a)
			if (i > 0) {
				fmt.Fprintf(w, ",")
			}
			fmt.Fprintf(w, "\"%s\"", a)
			i++
		}
	}
	fmt.Fprintf(w, "]")


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
		c string
		d string
	)
	q := "SELECT id, titolo, Autore, isbn, copertina, descrizione FROM libri WHERE 1=1"
	if quali=="vuoti"{
		q = q + " AND titolo = ''"
	}
	fmt.Println(q)
	r, err := db.Query( q )
	fmt.Println(err)
	i:=0
	var rr riga

	for r.Next() {
		r.Scan(&id, &t, &a, &isbn, &c, &d)
		rr.Titolo=t
		rr.Autore=a
		rr.Id=id
		rr.Img=c
		rr.Isbn=isbn
		rr.Desc=d
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
	http.HandleFunc("/libri/titolo", handlerLibri)
	http.HandleFunc("/libri/autore", handlerLibri)
	http.HandleFunc("/autori", handlerAutori)
	http.HandleFunc("/libri", handlerLibri)
	http.HandleFunc("/iban", handlerIban)
	http.HandleFunc("/ws", handlerWS)
	log.Fatal(http.ListenAndServe(":8080", nil))
}
