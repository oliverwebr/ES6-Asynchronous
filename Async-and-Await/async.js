// Our promise declaration
// nothing new, the exciting things start at ref[1]
function holdOn(forAWhile, context) {
  return new Promise((resolve, reject) => {
    if (forAWhile > 1000) {
      reject('Thats like a thousand internet years!', context);
    }
    setTimeout(() => resolve(`Ok but now we are Talking (${forAWhile}), context: ${context}`), forAWhile);
  })
}

///////////////////////
// how we did things //
///////////////////////
holdOn(10, 'then style')
  .then(data => {
    console.log(data);
    return data;
  })
  .catch(data => {
    console.error(data);
    return data;
  })


///////////////////////////////////////////////
// A new shiny way to handle promises ref[1] //
///////////////////////////////////////////////
async function go1() {
  console.log('go1 starts, lets await');
  const res = await holdOn(10, 'go1');
  console.log(res);
  console.log('go1 ends');
}
go1();

// but how can we handle erros now? 🤔
async function go2() {
  console.log('go2 starts, lets await');
  // this is rejected, we want that, but how do we handle it
  const res = await holdOn(100000, 'go2');
  console.log(res);
  console.log('go2 ends');
}
go2();

// try catch to the rescue
async function go3() {
  try {
    console.log('go3 starts, lets await');
    const res = await holdOn(100000, 'go3');
    console.log(res);
    console.log('go3 ends');
  } catch (err) {
    console.error('Oh Boy!', err)
  }
}
go3();

////////////////////////////////////////////////////////////
// high order function instead of try catching everywhere //
////////////////////////////////////////////////////////////
/**
 * [catchErrors description]
 * @param  {Function} fn function that we want to wrap
 * @return {Function}    the wrapper
 */
function catchErrors(fn) {
  // fn() is a promise but we need to return a function,
  // so we need another wrapper
  return function() {
    return fn().catch(err => {
      console.error('catchErrors() catched an error', err);
    });
  }
}

async function go4() {
  console.log('go4 starts, lets await');
  const res = await holdOn(100000, 'go4');
  console.log(res);
  console.log('go4 ends');
  console.error('Oh Boy!', err)
}
const wrappedFunction = catchErrors(go4);
wrappedFunction();
// hmmm that's nice but what if e.g. go4() takes a parameter?

////////////////////////////////////////
// high order function with parameter //
////////////////////////////////////////
function catchErrorsWithParameter(fn) {
  // we have a unkown amount of arguments
  // rest operator to the rescue
  return function(...args) {
    return fn(...args).catch(function(err) {
      console.error('catchErrors() catched an error', err);
    });
  }
}

async function go5(par) {
  console.log(par);
  console.log('go5 starts, lets await');
  const res = await holdOn(100000, 'go5');
  console.log(res);
  console.log('go5 ends');
  console.error('Oh Boy!', err);
}

const newWrappedFunction = catchErrorsWithParameter(go5);
newWrappedFunction('A Parameter!!!');

//////////////////////////////////
// Multiple Promises with await //
//////////////////////////////////
async function repos() {
  const user1 = fetch('https://api.github.com/users/afuh');
  const user2 = fetch('https://api.github.com/users/oliverwebr');
  // wait for both of them
  const res = await Promise.all([user1, user2]);
  const dataPromises = res.map(r => r.json());
  const [axel, oliver] = await Promise.all(dataPromises);
  console.log(axel, oliver);
}

repos();

// a simple abstraction
/**
 * [getGithubProfile description]
 * @param  {array} names  github usernames
 * @return {array} of awesome people
 */
async function getGithubProfile(names) {
  const promises = names.map(name => {
    return fetch(`https://api.github.com/users/${name}`).then(r => r.json());
  });
  const gihubUser = await Promise.all(promises);
  console.log(gihubUser);
}
getGithubProfile(['ayhamk94', 'afuh', 'spielhoelle', 'palomitaproy', 'ns4000', 'asjadbaig', 'oliverwebr']);

//////////////////////////////////////
// moving from callback to promises //
//////////////////////////////////////
// navigator takes to parameters a success callback and a error callback
navigator.geolocation.getCurrentPosition(function(pos) {
  console.log('it worked', pos);
}, function(err) {
  console.log('it failed!', err);
})

function getCurrentPosition(...args) {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(...args, resolve, reject);
  })
}

async function getPos() {
  const pos = await getCurrentPosition();
  console.log(pos);
}

getPos();
console.log('END OF ASYNC.JS');
