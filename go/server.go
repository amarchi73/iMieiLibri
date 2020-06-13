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

func handlerAdler(w http.ResponseWriter, r *http.Request) {

	r.ParseMultipartForm(0)

	t1 := r.FormValue("uno")
	t2 := r.FormValue("due")
	fmt.Println("Errore", t1)
	fmt.Println("Valore", t2)
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "*")
	fmt.Fprintf(w, "Ciao Adler %s!", "aa")

}

func handlerLibri(w http.ResponseWriter, r *http.Request){
	w.Header().Set("Access-Control-Allow-Origin", "*")
	if(1==0) {
		js, _ := ioutil.ReadFile("go/json.json")
		fmt.Fprintf(w, "%s", js)
	}else {
		righe := elencoLibri()
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

func elencoLibri() map[int]riga{

	righe:= make(map[int]riga)
	var (
		id int
		t string
		a string
	)
	r, err := db.Query(   `SELECT titolo, Autore, id FROM libri`)
	fmt.Println(err)
	i:=0
	var rr riga

	for r.Next() {
		r.Scan(&t, &a, &id)
		rr.Titolo=t
		rr.Autore=a
		rr.Id=id
		rr.Img="https://picsum.photos/300/300?"+fmt.Sprintf("%s",i)
		righe[i]=rr


		//fmt.Println(righe[i])
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
}

var db *sql.DB

func main() {
	var err error
	db, err = sql.Open("sqlite3","go/mieilibri.sqlite")
	defer db.Close()
	fmt.Println("DB ", err)

	fmt.Println("ciao!!!!")
	http.HandleFunc("/", handler)
	http.HandleFunc("/libriset", handlerAdler)
	http.HandleFunc("/libri", handlerLibri)
	log.Fatal(http.ListenAndServe(":8080", nil))
}
