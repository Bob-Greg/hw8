import React, {ReactElement, useState} from 'react';
import './App.css';
import {TextBox} from "./text-box";

type EntryProps = {
    in: string
    out: string
    ans: string
    ansCorrect: boolean
}

type RFProps = {
    fileName: string
}

function Entry(props: EntryProps) {
    return (
        <li>
            {props.in}<br/>
            {props.out}<br/>
            <span className={(props.ansCorrect) ? "text-green-800" : "text-red-800"}>{props.ans}</span><br/><br/>
        </li>
    )
}

function Rf(props: RFProps) {
    return (
        <li>
            Reading {props.fileName}
        </li>
    )
}

function arrts(arr: Array<any>) {
    let str = "["
    str += arr.toString().replaceAll(",", ", ")
    str += "]"
    return str
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

function bubble(arr:Array<any>, comp: (a:number, b:number) => number) {
    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
            if (comp(arr[j], arr[j + 1]) > 0) {
                let tmp = arr[j]
                arr[j] = arr[j + 1]
                arr[j + 1] = tmp
            }
        }

    }
    return arr
}

type File = {
    fileName: string
    fileContent: string
}

function App() {

    const [list, setList] = useState(new Array<ReactElement>(0))
    const [inTxt, setInTxt] = useState("")
    const [outTxt, setOutTxt] = useState("")
    let ran = false

    function solve(inTxt: File, outTxt: File) {
        const inStr = inTxt.fileContent.replaceAll("\n", " ")
        const nums = inStr.split(" ").map((str: string) => parseInt(str))
        const expected = parseInt(outTxt.fileContent)
        const N = nums[0]
        let minX = Number.MAX_VALUE
        let minY = Number.MAX_VALUE
        let maxX = Number.MIN_VALUE
        let maxY = Number.MIN_VALUE
        for (let i = 0; i < N; i++) {
            const j = i * 2 + 1
            const x = nums[j], y = nums[j + 1]
            minX = Math.min(x, minX)
            maxX = Math.max(x, maxX)
            minY = Math.min(y, minY)
            maxY = Math.max(y, maxY)
        }
        const area = (maxX - minX) * (maxY - minY)
        return <Entry ansCorrect={area === expected} in={`${inTxt.fileName} ${inStr}`} out={`${outTxt.fileName} ${outTxt.fileContent}`} ans={area.toString(10)}></Entry>
    }

    function runManual() {
        setList([solve({fileName: "Manual/in", fileContent: inTxt}, {fileName: "Manual/out", fileContent: outTxt})])
    }

    async function run(_sleep: boolean) {
        if (ran) {
            return
        }
        ran = true
        let l: ReactElement[] = []
        for (let i = 1; i <= 3; i++) {
            let inTxt: any = undefined
            await fetch(`${window.location.href}/linux-sample${i}in.txt`)
                .then(resp => resp.text())
                .then(dat => inTxt = dat)
            let outTxt: any = undefined
            await fetch(`${window.location.href}/linux-sample${i}out.txt`)
                .then(resp => resp.text())
                .then(dat => outTxt = dat)
            while (inTxt === undefined || outTxt === undefined) ;
            l = [...l]
            if (_sleep)
                l.splice(l.length - 1, 1)
            l.push(solve({fileName: `/linux-sample${i}in.txt`, fileContent: inTxt}, {fileName: `/linux-sample${i}out.txt`, fileContent: outTxt}))
            if (i !== 4 && _sleep)
                l.push(<Rf fileName={`/${i + 1}.in, /${i + 1}.out (I made it sleep for 500ms to make it look cool :(( )`}/>)
            setList(l)
            if (_sleep)
                await sleep(500)
        }
    }

    return (
        <div className={"mt-6 ml-6 mb-6 mr-6 pl-1.5 pt-1 wh-full overflow-auto space new-text-aqua new-box-aqua"}>
            ABCs<br/>
            https://github.com/bob-greg/hw8<br/><br/>
            <button onClick={() => {
                    if (ran) {
                        return
                    }
                    ran = false
                    run(true)
                }}
                className={"rounded-xl new-button-amber pl-1.5 pr-1.5 transition new-text-amber ease-in-out delay-50 hover:bg-sky-400 hover:text-white duration:300 pl-1 pr-1"}
            >
                run default test cases slowed!
            </button>
            <br/>
            <div className={"pt-3"}></div>
            <button onClick={() => {
                    if (ran) {
                        return
                    }
                    ran = false
                    run(false)
                }}
                className={"rounded-xl new-button-amber pl-1.5 pr-1.5 transition new-text-amber ease-in-out delay-50 hover:bg-sky-400 hover:text-white duration:300 pl-1 pr-1"}
            >
                run default test cases @ full speed!
            </button>
            <br/>
            <br/>
            Custom test cases:
            <div className={"pb-1"}/>
            <TextBox defaultText={"*.in here"} customCss={"rounded-xl new-text-amber pl-1.5 pr-1.5 new-button-amber"} onChange={str => setInTxt(str)}/>
            <div className={"pb-3"}/>
            <TextBox defaultText={"*.out here"} customCss={"rounded-xl new-text-amber pl-1.5 pr-1.5 new-button-amber"} onChange={str => setOutTxt(str)}/>
            <div className={"pb-3"}/>
            <button onClick={() => {
                if (ran) {
                    return
                }
                ran = false
                runManual()
            }}
                    className={"rounded-xl new-button-amber pl-1.5 pr-1.5 transition new-text-amber ease-in-out delay-50 hover:bg-sky-400 hover:text-white duration:300 pl-1 pr-1"}
            >
                run custom test case!
            </button>
            <br/>
            <br/>
            <ul className={"list-disc list-inside pl-3 text-sm mono"}>
                {list}
            </ul>
        </div>
    );
}

export default App;
