/////////////
// Example 1 //
/////////////
class Repository {
  constructor (username, rootElement){
    // our DOM Nodes
    this.username = username;
    this.rootNode = rootElement;

    this.repositories = this.getData(); // promise from fetch

    // calling render here is save as in the render function we wait for
    // this.repositories to be resolved
    this.render();
  }

  getData() {
    // fetch returns a promise
    return fetch(`https://api.github.com/users/${this.username}/repos`)
  }

  render() {
    this.repositories
      .then(data => data.json())
      .then(data => {
        if (data.status >= 400) {
          this.failureTemplate(data);
        } else {
          //  status code is smaller than 400 display via successTemplate
          this.rootNode.innerHTML = this.successTemplate(data);
        }
      })
      .catch(err => {
        // we catch here if fetch didn't work
        this.failureTemplate('fetch did not work');
      })
  };

  successTemplate(data) {
    return `
      <h2>${this.username}</h2>
      <ul>
        ${data.map(item => {
            return `<li>${item.name}</li>`
          }).join('')}
      </ul>
    `
  }

  failureTemplate(data) {
    return new Error('No repos for that user');
  }
}


const searchInput = document.querySelector('input').value;
const searchButton = document.querySelector('a.button.search');

// we create a new instance on every click
// not nice, but it works see a better example in solution 2
searchButton.addEventListener('click', (e) => {
  e.preventDefault();
  return new Repository(searchInput, document.querySelector('#root'));
});
