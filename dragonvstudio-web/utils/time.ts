function calcTime(date: Date, offset:  any) {
 
    var  utc = date.getTime() + (date.getTimezoneOffset() * 60000); 
    var nd = new Date(utc + (3600000*offset)); 
    return nd;
    
}

export default calcTime;