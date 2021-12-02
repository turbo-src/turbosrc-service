//import fetch from "node-fetch";
const got = require('got');
//import got from 'got';

async function post() {
  await got.post('http://localhost:4000/graphql', {
	json: {
		//hello: 'world'
    //query: '{ newPullRequest(pr_id: "b", contributor_id: "2", side: 1) { vote_code } }'
    //query: '{ getVote(pr_id: "a", contributor_id: 1) {side} }'
    //query: '{ getVoteAll(pr_id: "a") { vote_code } }'
    query: '{ getVoteEverything }'
    //query: '{ setVote(pr_id: "b" contributor_id: "1", side: 0 ) { vote_code } }'
    //query: '{ setVote(pr_id: "c" contributor_id: "2", side: 1 ) { vote_code } }'
	}
  }).json()

}

const data = post()

console.log(data)

//const response = await fetch('http://localhost:4000/graphql', {
//	method: 'post',
//  //body: JSON.stringify({ query: '{ newPullRequest(pr_id: "b", contributor_id: "2", side: 1) { vote_code } }' }),
//  //body: JSON.stringify({ query: '{ newPullRequest(pr_id: "c", contributor_id: "1", side: 1) { vote_code } }' }),
//  //body: JSON.stringify({ query: '{ getVote(pr_id: "a", contributor_id: 1) {side} }' }),
//  //body: JSON.stringify({ query: '{ getVoteAll(pr_id: "a") { vote_code } }' }),
//  body: JSON.stringify({ query: '{ getVoteEverything }' }),
//  //body: JSON.stringify({ query: '{ setVote(pr_id: "b" contributor_id: "1", side: 0 ) { vote_code } }' }),
//  //body: JSON.stringify({ query: '{ setVote(pr_id: "c" contributor_id: "2", side: 1 ) { vote_code } }' }),
//	headers: {'Content-Type': 'application/json'}
//});
//const data = await response.json();
//
//console.log(data);