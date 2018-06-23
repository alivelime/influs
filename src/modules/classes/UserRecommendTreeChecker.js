
export default class UserRecommendTreeChecker {

	// selected ids. do not use Object, because of cannot keep checked order.
	recommendBranchIds = [];
	recommendIds = [];

	recommendHandlers = {};
	recommendBranchHandlers = {};
	uncheckers = {};

	addRecommendHandler(name, handler) {
		this.recommendHandlers[name] = handler;
	}
	removeRecommendHandlers(name) {
		delete this.recommendHandlers[name];
	}

	addRecommendBranchHandler(name, handler) {
		this.recommendBranchHandlers[name] = handler;
	}
	removeRecommendBranchHandlers(name) {
		delete this.recommendBranchHandlers[name];
	}

	checkRecommend(id, url, value, unchecker) {
		if (value === true) {
			this.recommendIds.push(id);
			this.uncheckers[id] = unchecker;
		} else {
			this.recommendIds.splice(this.recommendIds.indexOf(id), 1);
			delete this.uncheckers[id];
		}

		for (const k in this.recommendHandlers) {
			this.recommendHandlers[k](id, url, value);
		}
	}
	checkRecommendBranch(id, value, unchecker) {
		if (value === true) {
			this.recommendBranchIds.push(id);
			this.uncheckers[id] = unchecker;
		} else {
			this.recommendBranchIds.splice(this.recommendBranchIds.indexOf(id), 1);
			delete this.uncheckers[id];
		}

		for (const k in this.recommendBranchHandlers) {
			this.recommendBranchHandlers[k](id, value);
		}
	}

	getRecommendBranchIds() {
		return this.recommendBranchIds;
	}
	getRecommendIds() {
		return this.recommendIds;
	}

	uncheckAll() {
		for (const k in this.uncheckers) {
			this.uncheckers[k]();
		}
	}

}

