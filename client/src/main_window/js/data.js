// this function manages thr data in the friend.json
// input: str ('delete_data' || 'get_friends'), array(list of friends)
// output: void
let main = (a, b=[]) => {
    // get data from friend.json
    // type: JSON
    let data = JSON.parse(
        fs.readFileSync('./src/data/friend.json')
    )
    
    // like switch(){}
    let bag = {
        'delete_data' : () => {
            data.friends = []
            data.favorite = []
        },
        'get_friends': b => {
            data.friends = b
        }
    }
    bag[a] && bag[a](b)

    // write data to friend.json
    fs.writeFileSync(
        './src/data/friend.json',
        JSON.stringify(data)
    )
}

module.exports = {main}