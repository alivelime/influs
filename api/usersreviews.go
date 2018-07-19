package api

import (
	"fmt"
	"net/http"

	"google.golang.org/appengine"

	"github.com/alivelime/influs/model/reviews"
)

func getUserReviews(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)

	userId, ok := getPathParamInt64(w, r, "userId")
	if !ok {
		return
	}

	ret, err := reviews.GetUserReviews(ctx, userId)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response(w, ret)
}

func HandleUserReviews(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		getUserReviews(w, r)

	default:
		http.Error(w, fmt.Sprintf("No impliment method %s", r.Method), http.StatusInternalServerError)
	}
}
