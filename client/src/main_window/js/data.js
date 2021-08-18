// this function manages thr data in the freind.json
// input: str ('delete_data')
// output: void
let main = a => {
    // get data from friend.json
    // type: JSON
    let data = JSON.parse(
        fs.readFileSync('./src/data/friend.json')
    )
    
    let bag = {
        'delete_data' : () => {
            data.friends = []
            data.favorite = []
        }
    }
    bag[a] && bag[a]()

    // write data to friend.json
    fs.writeFileSync(
        './src/data/friend.json',
        JSON.stringify(data)
    )
}

module.exports = {main}