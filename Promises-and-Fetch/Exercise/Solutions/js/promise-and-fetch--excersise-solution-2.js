//////////////
//Example 2 //
//////////////
{
  class Repository {
    constructor (repoContainer, valueSrc, eventSrc){
      // Dom Nodes
      this.rootNode = repoContainer;
      this.eventSrc = eventSrc;
      this.valueSrc = valueSrc;

      // initializing
      this.init();
    }

    init() {
      // adding an eventlistener to our eventSrc aka a.button.search
      this.eventSrc.addEventListener('click', (e) => this.setUser(e));

      // username promise from userNamePromise()
      this.username = this.userNamePromise();
      this.username
        // setting username as property
        .then(username => this.username = username)
        .then(() => {
          // now that we have our username we can saftly call getData()
          this.data = this.getData()

          // calling render here is save as in the render function we wait for
          // this.repositories to be resolved
          this.render()
        })
    }

    getData() {
      return new Promise((resolve, reject) => {
        const fetching = fetch(`https://api.github.com/users/${this.username}/repos`);
        return fetching
          .then(data => data.json())
          .then(data => {
            resolve(data)
          }).catch(err => {
            console.error('fetching does not work', err)
          })
      })
    }

    userNamePromise() {
      return new Promise((resolve, reject) => {
        // we uplift the resolve function to call from the outside ref[1]
        this.usernameSet = resolve
      }).then(data => {
        console.log(data, 'promise resolved with user name')
        return data;
      })
    }

    setUser(e) {
      e.preventDefault();
      // ref[1] here we use the uplifted resolve from userNamePromise
      this.usernameSet(new String(this.valueSrc.value));
    }

    validateData() {
      // we need to validate our getData
      // this is just a mock
      return true;
    }

    render() {
      console.log('render called')
      // render waits for data to be resolved
      this.data.then(data => {
        this.rootNode.innerHTML = this.successTemplate(data);
      }).catch(err => {
        failureTemplate(err);
      })
    }

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

  const repoContainer   = document.querySelector('#root');
  const searchInput     = document.querySelector('input');
  const searchButton    = document.querySelector('a.button.search');
  const repoList        = new Repository(repoContainer, searchInput, searchButton);
}
