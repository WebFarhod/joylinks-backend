const { PAGE, LIMIT } = require("../configs/config");

const getPageLimit = (page, limit) => {
    // limit
    limit = parseInt(limit) || LIMIT;   
    
    // page/offset
    page = parseInt(page) || PAGE; 
    const skip = (page - 1) * limit;

    return {skip, limit}
}

module.exports = {
    getPageLimit
}