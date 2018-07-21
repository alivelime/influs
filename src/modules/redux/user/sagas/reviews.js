import { call, put } from 'redux-saga/effects'
import { postAPI, deleteAPI } from 'modules/utils/Request';

export function* add(action) {

	// add recommend and evidence.
	let res = {recommend: null, review: null, evidence: null, addRecommendBranch: null};
	let patch = []; // for addSubRecommendBranch

	// do not replace put 'ADD_RECOMMEND_REQUEST' because need to apply result all at once.
	res.recommend = yield call(postAPI, `/api/recommends`, action.recommend);
	if (action.evidence && action.evidence.length > 0) {
		res.evidence = yield call(postAPI, `/api/recommends`, action.evidence);
	}

	let addFlag = action.isRecommend ? false : true;
	if (addFlag) {
		const param = actions.addSubrecommend(
			action.recommendBranchId,
			action.review.userId,
			action.review.recommendId, 
			action.recommendBranches);

		res.addRecommendBranch = yield call(postAPI, `/api/recommend-branches`, param.data, action.token);
		action.review.recommendBranchId = res.addRecommendBranch.id;
		patch.push({id: param.patch.prevId, nextId: res.addRecommendBranch.id});

	} else {
		action.review.recommendBranchId = action.recommendBranchId;
	}

	res.review = yield call(postAPI, `/api/reviews`, action.review, action.token);
	if (Object.keys(res.review).length === 0) {
		if (addFlag) {
			yield call(deleteAPI, `/api/recommend-branches/${action.review.recommendBranchId}`, action.token);
			// do not -> yield put({type: 'DELETE_RECOMMEND_BRANCHES_REQUEST', ids: [action.review.recommendBranchId]});
		}
		return;
	}

	yield put({type: "ADD_REVIEW_SUCCEEDED",
		review: res.review,
		recommend: res.recommend,
		evidence: res.evidence,
		addRecommendBranch: res.addRecommendBranch,
	});

	if (patch.length > 0) {
		yield put({type: "UPDATE_RECOMMEND_BRANCHES_REQUEST", patch, token: action.token});
	}
}


