import React from 'react'
import { Link } from 'react-router-dom'

const SideBar: React.FC = () => {
  return (
    <div className='w-30 bg-amber-200 h-screen sticky left-0 top-0 mr-2 p-2'>
        <nav>
            <ul>
                <li className='hover:text-blue-600'>
                    <Link to='/'>Home</Link>
                </li>
                <li className='hover:text-blue-600'>
                    <Link to='/about'>About</Link>
                </li>
                <li className='hover:text-blue-600'>
                    <Link to='/register'>Register</Link>
                </li>
            </ul>
        </nav>
    </div>
  )
}

export default SideBar