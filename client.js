import fetch from "node-fetch";
//fetch('http://localhost:4000/graphql', {
//  method: 'POST',
//  body: JSON.stringify({ query: 'query { hello }' })
//  headers: {'Content-Type': 'application/json'}
//})
//.then(response => response.json())
//.then(json => {
//  alert('Found ' + result.data.allPosts.length + ' posts');
//})

const response = await fetch('http://localhost:4000/graphql', {
	method: 'post',
  body: JSON.stringify({ query: '{ newPullRequest(pr_id: "a", contributor_id: "1", side: 1) { vote_code } }' }),
  //body: JSON.stringify({ query: '{ getVote(pr_id: "a", contributor_id: 1) {side} }' }),
  //body: JSON.stringify({ query: '{ getVoteAll(pr_id: "a") {side} }' }),
  //body: JSON.stringify({ query: '{ setVote(pr_id: "a" contributor_id: "2", side: 0 ) {side} }' }),
	headers: {'Content-Type': 'application/json'}
});
const data = await response.json();

console.log(data);