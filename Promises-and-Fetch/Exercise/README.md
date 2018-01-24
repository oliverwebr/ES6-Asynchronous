# Exercise Fetch, Class etc.
Use fetch to get a list of repositories for a provided username.
use: https://developer.github.com/v3/repos/#list-user-repositories
## Target
  - Webpage with a search bar and a container for search results
  - Users can search for a github user name and see a list of the their repositories
  - The 'Application' should be able to have multiple instances


```javascript
class UserRepositories {
  constructor (username, rootElement){...}

  getData() {...}

  render() {...}

  successTemplate(data) {...}

  failureTemplate(data) {...}

}
```
