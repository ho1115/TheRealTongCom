
export default async function textCompare(textA, textB) {

    const input = {"textA" : textA, "textB": textB, "textC" : undefined}
    const spawner = require('child_process').spawn;
    const compPy = spawner('python', ['./compare.py', JSON.stringify(input)])
    
    
    compPy.stdout.on('data', (data) => {console.log('test:\n', JSON.parse(data.toString()))} )

    return input
}