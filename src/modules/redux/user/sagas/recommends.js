import { call, put } from 'redux-saga/effects'
import { postAPI } from 'modules/utils/Request';

function* addRecommend(action) {
	try{
		const res = yield call(postAPI, `/api/recommends`, action.data);
		if (Object.keys(res).length > 0) {
			yield put({type: "ADD_RECOMMEND_SUCCEEDED", data: res});
		} else {
			yield put({type: "ADD_RECOMMEND_FAILED"});
		}
	} catch (e) {
		yield put({type: "ADD_RECOMMEND_FAILED");
	}
}


