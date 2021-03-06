package api

import (
	"fmt"
	"net/http"

	"google.golang.org/appengine"

	"github.com/alivelime/influs/model/timelines"
)

func getUserTimeline(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)

	userId, ok := getPathParamInt64(w, r, "userId")
	if !ok {
		return
	}
	if getUserCache(ctx, w, userId, prefixUserTimeline) {
		return
	}

	i, me, err := timelines.GetUserTimeline(ctx, userId)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if len(i) == 0 && len(me) == 0 {
		http.Error(w, "", http.StatusNotFound)
		return
	}

	ret := make(map[string][]timelines.Timeline)
	if len(i) == 0 {
		ret["i"] = make([]timelines.Timeline, 0)
	} else {
		ret["i"] = i
	}
	if len(me) == 0 {
		ret["me"] = make([]timelines.Timeline, 0)
	} else {
		ret["me"] = me
	}

	if !setUserCache(ctx, w, userId, prefixUserTimeline, ret) {
		return
	}
	response(w, ret)
}

func HandleUserTimeline(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		getUserTimeline(w, r)

	default:
		http.Error(w, fmt.Sprintf("No impliment method %s", r.Method), http.StatusInternalServerError)
	}
}
