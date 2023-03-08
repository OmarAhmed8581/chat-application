
export function randomString() {
	let s = (Math.floor(1000 + Math.random() * 9000));
	return s;
}
export const genRand = (len) => {
	return Math.random().toString(36).substring(2,len+2);
}