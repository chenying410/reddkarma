"use client"

import { useState, useEffect, useCallback } from 'react'
import Grid from '@mui/material/Grid2'

import UserListCards from './UserListCards'
import UserListTable from './UserListTable'

// Styles Imports
import frontCommonStyles from './front-styles.module.css'

const Dashboard = () => {
const [users, setUsers] = useState([]);

  useEffect(() => {
     
      async function fetchData() {
        const res = await fetch('/api/dashboard');
        if (res && res.ok) {
          const obj = await res.json();
          const users = obj.data;
          setUsers(users);
        }
      }
      
      fetchData();
    }, []);

    console.log(users);

  return (
    <section className='plb-[30px] bg-backgroundPaper'>
      <div className={frontCommonStyles.layoutSpacing}>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12 }}>
            <UserListCards usersWithSubscriptions ={users} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <UserListTable tableData={users} />
          </Grid>
        </Grid>
      </div>
    </section>
  )
}

export default Dashboard
