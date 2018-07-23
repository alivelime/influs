import { connect } from 'react-redux';

import * as actions from 'modules/redux/user/actions';
import RecommendBranch from 'modules/components/RecommendBranch';

// for performance reference http://anect.hatenablog.com/entry/2018/04/05/124654
const mapStateToProps = (state, props) => ({
	token: state.session.token,
	isMine: (state.session.user.id !== undefined && state.user.id === state.session.user.id),

	isChecked: state.checker.recommendIds.includes(props.id)
					|| state.checker.recommendBranchIds.includes(props.id),

	recommendBranches: state.recommendBranches,
	recommendId: props.id !== "0" && state.recommendBranches[props.id].recommendId,
	isOpen: props.id !== "0" && state.recommendBranches[props.id].isOpen,
});
const mapDispatchToProps = dispatch => ({ dispatch });
const mergeProps = (state, {dispatch}, props) => {
	console.log("RecommendBranch mergeProps "+props.id);
	return {
	...props,
	isMine: state.isMine,
	isChecked: state.isChecked,
	recommendId: state.recommendId,
	isOpen: state.isOpen,

	childIds: getChildren(state.recommendBranches, props.id, dispatch, state.token),

	handleCollapse: state.isOpen
		? () => {dispatch(actions.closeRecommendBranch(props.id))}
		: () => {dispatch(actions.openRecommendBranch(props.id))}
	,
	handleCheck: props.parentIsChecked 
		? () => {}
		: () => {
			state.recommendId
				? (state.isChecked
					? dispatch(actions.uncheckRecommend(props.id)) 
					: dispatch(actions.checkRecommend(props.id, state.recommendId)))
				: (state.isChecked 
					? dispatch(actions.uncheckRecommendBranch(props.id)) 
					: dispatch(actions.checkRecommendBranch(props.id)))
			}
	,
	};
};

/*
 * this.state.recommendBranches, recommends, reviews is one level list.
 * do not make complex as nested object.
 */
function getChildren(_recommendBranches, parentId, dispatch, token) {
	// deep copy state.recommendBranches
	let recommendBranches = {};
	Object.keys(_recommendBranches).forEach((id) => {
		recommendBranches[id] = Object.assign({}, _recommendBranches[id]);
	});
	let children = [];

	// find parent id.
	const list = Object.keys(recommendBranches).filter((id) => {
		return recommendBranches[id].parentId === parentId;
	});
	if (list.length > 0) {
		let patchIds = [];

		const firsts = list.filter((id) => {
			return recommendBranches[id].prevId === "0";
		});

		let first;
		if (firsts.length >= 1) {
			first = firsts[0];
		} else {
			// if prevId is "0" not found.
			console.log("could not find first elem.");
			first = list[0];

			// fix prevId = "0"
			let recommendBranch = recommendBranches[first];
			recommendBranch.prevId = "0";
			patchIds.push(first);
		}

		let outOfLinks = {};
		list.forEach(id => outOfLinks[id] = null);

		let id, prevId;
		for (id = first;
				list.indexOf(id) >= 0;
				id = recommendBranches[id].nextId)
		{
			// check out of link.
			prevId = id;
			delete outOfLinks[id];
			children.push(id);
			
			// check if nextId is loop
			const nextId = recommendBranches[id].nextId;
			if (list.indexOf(nextId) >= 0 &&
					!outOfLinks.hasOwnProperty(nextId)
			) {
				console.log("recommend branches is loop!");
				// fix netxtId to zero.
				recommendBranches[id].nextId = "0";
				patchIds.push(id);
				break; // last recommendBranches is outOfLinks
			}
		}

		// if link is broken. concat last recommendBranches.
		if (Object.keys(outOfLinks).length > 0) {
			patchIds.push(prevId);
			Object.keys(outOfLinks).forEach((id) => {
				console.log(`link list is broken. so fix it. ${parentId}`);

				recommendBranches[prevId].nextId = id;

				recommendBranches[id].prevId = prevId;
				recommendBranches[id].nextId = "0";
				children.push(id);
				patchIds.push(id);

				prevId = id;
			});
		}

		if (patchIds.length > 0 && token) {
			dispatch(actions.updateRecommendBranches(patchIds.map(id => recommendBranches[id]), token));
		}
	} else {
		// if recommend branch is empty.
		// but do not addRecommendBranch.
		// Because recommendBranches is empty when ComponentDidMount() called.
	}

	return children;
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
	mergeProps
)(RecommendBranch);

