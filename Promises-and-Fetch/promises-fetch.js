/*****************************************************************
 *
 * Promises
 *
 * Promises are built-in to many libraries and functions like
 * fetch(), but we can also build our own promises.
 *
 * Sitenote:
 * fetch() is similar to jQuery's .get() method.
 *
 ****************************************************************/

// Get the current IP address of your machine
const getIpPromise = fetch('https://api.ipify.org/?format=json')

// Nothing there? Hmm ... we get a Promise instead of the result
console.log('Done!')
console.log(getIpPromise)

/**
 * We use built-in promises of the fetch() function here:
 *
 * .then()  is fired, when the request is successful
 * .catch() is fired, when the request has an error
 */
getIpPromise
  .then((response) => response.json())
  .then((data) => { console.log(data) })
  .catch((error) => {
    console.error(error)
  })

/**
 * Creating our own promise
 *
 * Whenever you call the callback resolve() the promise returns as being successfully
 * resolved and an existing .then() will be fired.
 *
 * Whenever you call the callback reject() the promise returns as not being successfully
 * resolved and an existing .catch() will be fired.
 */
const exercisePromiseResolve = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('This is our own promise. Yay!')
  }, 1500)
})

exercisePromiseResolve
  .then((data) => {
    console.log(data)
  })

const exercisePromiseReject = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject('This is our own failed promise. Oh no!')
  }, 3000)
})

exercisePromiseReject
  .then((data) => {
    console.log(data)
  })
  .catch((error) => {
    console.log(error)
  })

/**
 * Chaining promises, in a waterfall kind of way
 *
 * We're simulating database queries here, that might happen one after another:
 * - First getting a post by id
 * - Second getting the matching author by id
 */

const posts = [
  { title: 'JavaScript is great!', 'author': 2, id: 1 },
  { title: 'Bootstrap 4 is out!', 'author': 3, id: 2 },
  { title: 'How to use the Chrome Dev Console', 'author': 1, id: 3 },
  { title: 'Dead authors are dead', 'author': 4, id: 4 }
]

const authors = [
  { name: 'Peter Parker', twitter: '@peterparker', bio: 'Australian Coder', id: 1 },
  { name: 'Paul Shawn', twitter: '@paulshawn', bio: 'British CSS fanatic', id: 2 },
  { name: 'Mary Poppins', twitter: '@marrypoppins', bio: 'Nanny of developers', id: 3 }
]

function getPostById(id) {
  // create a new promise
  return new Promise((resolve, reject) => {
    // using setTimeout to mimick a database query delay
    setTimeout(() => {
      // find the post we want
      const post = posts.find((post) => post.id === id)

      if (post) {
        // send the post back
        resolve(post)
      } else {
        reject(Error('No post was found!'))
      }
    }, 3500)
  })
}

function getAuthorByPost(post) {
  // create a new promise
  return new Promise((resolve, reject) => {
    // find the author we want
    const authorDetails = authors.find((person) => person.id === post.author)

    if (authorDetails) {
      // send the details back
      resolve(authorDetails)
    } else {
      reject(Error('No author was found!'))
    }
  })
}

getPostById(4)
  .then((post) => {
    console.log('Found the post!')

    // we return a new promise, to chain another .then() that handles
    // the extended post data
    return new Promise((resolve, reject) => {
      getAuthorByPost(post)
        .then((author) => {
          post.author = author
          resolve(post)
        })
        .catch((error) => {
          reject(error)
        })
    })
  })
  .then((post) => {
    console.log(' => Found the author!')
    console.log(post)
  })
  .catch((error) => {
    console.error(error)
  })

/**
 * Waiting for multiple promises at the same time
 *
 * We're calling 2 APIs:
 * - First the apify IP address API
 * - Second the current bitcoin price in EUR
 *
 * Sitenote:
 * The call of .json() on the response objects is needed, as their might be
 * different kinds of responsoes and we don't always get JSON. Other response
 * types could for exmaple be blobs, text or formData.
 */
function multiplePromises() {
  const ipPromise = fetch('https://api.ipify.org/?format=json')
  const bcPricePromise = fetch('https://api.coindesk.com/v1/bpi/currentprice/eur.json')

  Promise
    // wait for all promises of an array
    .all([ipPromise, bcPricePromise])
    .then((responses) => {
      // wait for all of the .json() calls we need
      return Promise.all(responses.map((response) => response.json()))
    })
    .then((data) => {
      const [ip, bitcoin] = data
      console.log('ip and bitcoin')
      console.log(ip)
      console.log(bitcoin)
    })
}

// Adding a timeout to wait for the other demos
setTimeout(() => {
  multiplePromises()
}, 5000)
