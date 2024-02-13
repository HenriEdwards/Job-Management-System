import { Link } from 'react-router-dom'

const Nav = () => {
  
  return (
    <header>
      <div className="container">
        <Link to="/">
          <h1>Job Maintenance</h1>
        </Link>
      </div>
    </header>
  )
}

export default Nav