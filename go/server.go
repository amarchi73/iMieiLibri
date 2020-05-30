package main

import (
	"fmt"
	"github.com/gorilla/websocket"
	"io/ioutil"
	"log"
	"net/http"
)

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
	json, _:=ioutil.ReadFile("go/json.json")

	w.Header().Set("Access-Control-Allow-Origin", "*")
	fmt.Fprintf(w, "%s", json)

}

func main() {
	fmt.Println("ciao!")
	http.HandleFunc("/", handler)
	http.HandleFunc("/libriset", handlerAdler)
	http.HandleFunc("/libri", handlerLibri)
	log.Fatal(http.ListenAndServe(":8080", nil))
}
