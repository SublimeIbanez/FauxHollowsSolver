"use client"

import { useState, useMemo } from "react";
import { Boards, Block } from "./board_layouts";


export default function Home() {
    const [selectedBlock, changeBlock] = useState(Block.Locked);

    const [board, changeBoard] = useState(Boards.Default);

    return (
        <body className="flex h-screen flex-col w-screen items-center justify-start gap-2 p-10 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 overflow-hidden">
            <div className="text-5xl font-bold text-white text-center" key="Header">Faux Hollows Solver</div>
            <div className="flex flex-col h-full w-full" key="Primary section">
                <button
                    key={`reset button`}
                    className="py-1 bg-sky-500 rounded-md my-4 text-white text-lg font-bold w-full px-20 self-center"
                    onClick={_ => {
                        changeBoard(Boards.Default);
                        changeBlock(Block.Locked);
                    }}
                >Reset Board</button>
                <div className="flex gap-4 sm:flex-row justify-around mb-6" key="board div">
                    <div>
                        <ul className="flex flex-col gap-1">
                            <li><button
                                className="p-3"
                                style={{
                                    backgroundColor: Block.Locked.toString(),
                                    border: "4px solid",
                                    borderColor: selectedBlock === Block.Locked ? "green" : Block.Locked.toString()
                                }}
                                onClick={_ => changeBlock(Block.Locked)}
                            ></button></li>
                            <li><button
                                className="p-3"
                                style={{
                                    backgroundColor: Block.Blank.toString(),
                                    border: "4px solid",
                                    borderColor: selectedBlock === Block.Blank ? "green" : Block.Blank.toString()
                                }}
                                onClick={_ => changeBlock(Block.Blank)}
                            ></button></li>
                            <li><button
                                className="p-3"
                                style={{
                                    backgroundColor: Block.Swords.toString(),
                                    border: "4px solid",
                                    borderColor: selectedBlock === Block.Swords ? "green" : Block.Swords.toString()
                                }}
                                onClick={_ => changeBlock(Block.Swords)}
                            ></button></li>
                            <li><button
                                className="p-3"
                                style={{
                                    backgroundColor: Block.Crate.toString(),
                                    border: "4px solid",
                                    borderColor: selectedBlock === Block.Crate ? "green" : Block.Crate.toString()
                                }}
                                onClick={_ => changeBlock(Block.Crate)}
                            ></button></li>
                            <li><button
                                className="p-3"
                                style={{
                                    backgroundColor: Block.Fox.toString(),
                                    border: "4px solid",
                                    borderColor: selectedBlock === Block.Fox ? "green" : Block.Fox.toString()
                                }}
                                onClick={_ => changeBlock(Block.Fox)}
                            ></button></li>
                        </ul>
                    </div>
                    <Board layout={board} setLayout={changeBoard} selectedBlock={selectedBlock} modifiable={true} />
                </div>
            </div>
            <div className="w-full flex justify-center overflow-hidden">
                <Solutions layout={board} modifiable={false} />
            </div>
        </body >
    );
};

type BoardProps = {
    layout: Block[][];
    setLayout?: React.Dispatch<React.SetStateAction<Block[][]>>;
    selectedBlock?: Block;
    modifiable: boolean;
    index?: number;
}

const Board = ({ layout, setLayout, selectedBlock, modifiable, index }: BoardProps) => {
    const handleClick = (row: number, column: number) => {
        if (!modifiable) {
            return;
        }
        const newLayout = layout.map(row => [...row]);
        if (layout[row][column] === selectedBlock!) {
            newLayout[row][column] = Block.Default;
        } else {
            newLayout[row][column] = selectedBlock!;
        }
        setLayout!(newLayout);
    };

    const padding = modifiable ? `p-3.5` : `p-3`;

    return (
        <div className="board" key={`board primary div ${index}`}>
            {layout.map((row, rowIndex) => (
                <div key={`board ${index} row ${rowIndex}`} className="flex">
                    {row.map((block, columnIndex) => (
                        <div
                            key={`board ${index} column ${columnIndex}`}
                            className={`${padding} border-2 border-black`}
                            style={{ backgroundColor: block }}
                            onClick={() => handleClick(rowIndex, columnIndex)}
                        ></div>
                    ))}
                </div>
            ))}
        </div>
    );
};

const Solutions = ({ layout }: BoardProps) => {
    const testEquality = (board: Block[][]) => {
        for (let row = 0; row < layout.length; ++row) {
            for (let column = 0; column < layout[row].length; ++column) {
                if (layout[row][column] !== Block.Default && layout[row][column] !== board[row][column]) {
                    return false;
                }
            }
        }
        return true;
    };

    const solutions = useMemo(() => {
        let list: Block[][][] = [];

        Object.entries(Boards).forEach(([set, board]) => {
            if (set !== "Default") {
                if (testEquality(board)) {
                    list.push(board);
                }
            }
        });

        return list;
    }, [layout, Boards]);

    const colStyle = (solutions.length < 4) ? `md:grid-cols-${solutions.length}` : `md:grid-cols-4`
    return (
        <div className={`faux-hollows-solutions grid grid-cols-2 ${colStyle} gap-4 min-w-0 sm:min-w-[768px] max-w-screen-md overflow-y-scroll`} >
            {solutions.map((set, index) => {
                return <Board layout={set} modifiable={false} index={index} />
            })}
        </div>
    );
}