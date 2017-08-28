package main

import (
	"net/http"
	"github.com/gin-gonic/gin"
	_"github.com/sjfricke/goply"
)

func main() {

	//goply.Test()

	router := gin.Default()

	router.LoadHTMLGlob("templates/index.html");

	router.Static("/libs", "./libs");
	router.Static("/models", "./models");
	router.Static("/js", "./js");
	router.Static("/styles", "./styles");
	
	router.GET("/", func(c *gin.Context) {
		c.HTML(
			http.StatusOK, "index.html", gin.H{
				"test" : "123",
			},
		)
	})
	
	router.Run() // listen and serve on 0.0.0.0:8080
}
