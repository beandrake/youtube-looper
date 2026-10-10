

// Given a string, returns a version without leading or trailing white space.
const trimOuterWhiteSpace = (text) => {
	return text.replace(/^\s+/, '').replace(/\s+$/, '');
}

export default trimOuterWhiteSpace;