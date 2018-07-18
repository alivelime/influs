package api

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/mux"

	"google.golang.org/appengine"
	"google.golang.org/appengine/datastore"

	"github.com/alivelime/influs/auth"
	"github.com/alivelime/influs/model/reviews"
)

func getReview(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)

	var review Review
	id, ok := getPathParamInt64(w, r, "id")
	if !ok {
		return
	}

	review, err := reviews.Get(ctx, id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	response(w, review)
}

func postReview(w http.ResponseWriter, r *http.Request) {
	var review Review
	ctx := appengine.NewContext(r)

	session, err := auth.CheckLogin(w, r)
	if err != nil {
		return
	}

	if ok := readParam(w, r, &review); !ok {
		return
	}

	// validation
	if review.UserID == 0 {
		http.Error(w, fmt.Sprintf("validation error: user id is required. "), http.StatusBadRequest)
		return
	}
	// is mine?
	if session.User.ID != review.UserID {
		http.Error(w,
			fmt.Sprintf("Not allow to post onother users .You %d, Param %d", session.UserID, recommendBranch.UserID),
			http.StatusBadRequest)
		return
	}

	// put
	if err := reviews.Put(ctx, &review); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response(w, review)
}

func deleteReview(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)

	session, err := auth.CheckLogin(w, r)
	if err != nil {
		return
	}

	id, ok := getPathParamInt64(w, r, "id")
	if !ok {
		return
	}

	review, err := reviews.Get(ctx, id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	// is mine?
	if session.User.ID != review.UserID {
		http.Error(w,
			fmt.Sprintf("Not allow to delete onother users .You %d, Param %d", session.UserID, review.UserID),
			http.StatusBadRequest)
		return
	}

	if err := reviews.Delete(ctx, id); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response(w, Empty{})
}

func HandleReviews(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "POST":
		postReview(w, r)

	default:
		http.Error(w, fmt.Sprintf("No impliment method %s", r.Method), http.StatusInternalServerError)
	}
}

func HandleReview(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		getReview(w, r)

	case "DELETE":
		deleteReview(w, r)

	case "PUT": // do not put
		fallthrough
	case "PATCH": // do not patch
		fallthrough
	default:
		http.Error(w, fmt.Sprintf("No impliment method %s", r.Method), http.StatusInternalServerError)
	}
}
