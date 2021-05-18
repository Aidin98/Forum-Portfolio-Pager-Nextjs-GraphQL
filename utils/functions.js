import moment from 'moment'
 export const formatDate=date=>{
   return moment.unix(date/1000).format('DD/MM/YY')
 }
export const fromNow=date=>moment.unix(date/1000).fromNow()
