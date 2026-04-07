import { DragEvent, useState, ChangeEvent } from "react";
import { text } from "stream/consumers";

const DropPGNBox = () => {
    return <div
        className="h-full border-2 border-dashed rounded-md border-zinc-500 bg-gray-800 text-gray-400 font-medium text-xl flex items-center justify-center drop-file">
        <svg className="w-8 h-8 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h3a3 3 0 0 0 0-6h-.025a5.56 5.56 0 0 0 .025-.5A5.5 5.5 0 0 0 7.207 9.021C7.137 9.017 7.071 9 7 9a4 4 0 1 0 0 8h2.167M12 19v-9m0 0-2 2m2-2 2 2" /></svg>
        Drop your PGN here
    </div>;
}

const isPGNFile = (type: string) => {
    return /^application\/(x-|vnd\.)chess-pgn$/.test(type)
}

const PGNInput = () => {

    const [showDropPGNBox, setShowDropPGNBox] = useState(false)
    const [pgnText, setPgnText] = useState('')

    const handleDragInput = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const items = e.dataTransfer?.items
        if (items?.length == 1 && isPGNFile(items[0]?.type)) setShowDropPGNBox(true)
    }

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setShowDropPGNBox(false)
    }

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setShowDropPGNBox(false)
        e.dataTransfer.files.item(0)?.text().then(text => setPgnText(text))
    }

    const handlePGNFileInput = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length == 1) {
            if (isPGNFile(files[0]?.type)) files[0].text().then(text => setPgnText(text))
            else alert('Please upload a valid PGN file')
        }
    }

    return <div className="rounded-md bg-gray-800 h-64 lg:h-80 focus-within:outline-2 focus-within:outline-gray-400" onDragEnter={handleDragInput} onDragOver={handleDragInput} onDragLeave={handleDragLeave} onDrop={handleDrop}>
        {showDropPGNBox ?
            <DropPGNBox /> :
            <div className="p-3 h-full relative">
                <textarea className="outline-none w-full h-full font-sans tracking-wide resize-none" autoComplete="off" spellCheck="false" name="pgnContent" id="pgnContent" placeholder="Enter your PGN text here" value={pgnText} onInput={e => setPgnText(e.currentTarget.value)} />
                <div className="absolute top-2 right-2">
                    <input className="hidden" type="file" name="pgnFile" id="pgnFile" onChange={handlePGNFileInput} accept=".pgn, application/x-chess-pgn, application/vnd.chess-pgn" multiple={false} />
                    <label htmlFor="pgnFile" className="size-8 lg:size-9 rounded-md bg-gray-900 inline-flex items-center justify-center hover:bg-gray-600 text-white m-1">
                        <svg className="size-5 lg:size-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.293 3.293a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1-1.414 1.414L13 6.414V16a1 1 0 1 1-2 0V6.414L8.707 8.707a1 1 0 0 1-1.414-1.414l4-4Z" fill="currentColor" />
                            <path d="M6 17a1 1 0 1 0-2 0v.6C4 19.482 5.518 21 7.4 21h9.2c1.882 0 3.4-1.518 3.4-3.4V17a1 1 0 1 0-2 0v.6c0 .778-.622 1.4-1.4 1.4H7.4c-.778 0-1.4-.622-1.4-1.4V17Z" fill="currentColor" />
                        </svg>
                    </label>
                </div>
            </div>
        }
    </div>;
};

export default PGNInput;
