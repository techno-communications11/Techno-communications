import React from 'react'
import { useContext } from 'react'
import { MyContext } from '../pages/MyContext'
import DetailedView from './DetailedView'

function StatsTicketView() {
    const {captureStatus}=useContext(MyContext)
    if(captureStatus)localStorage.setItem('captureStatus',captureStatus)
    const presisedstatus=captureStatus||localStorage.getItem("captureStatus")
  return (
    <DetailedView presisedstatus={presisedstatus}/>
  )
}

export default StatsTicketView
