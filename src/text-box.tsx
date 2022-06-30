import {ChangeEvent, useState} from "react";

export type TextBoxProps = {
    defaultText:string
    customCss:string
    onChange:(_:string) => void
}

export const TextBox = (props:TextBoxProps) => {

    const [text, setText] = useState(props.defaultText)

    function change(ev:ChangeEvent<HTMLTextAreaElement>) {
        setText(ev.target.value)
        props.onChange(ev.target.value)
    }

    return (
        <div>
            <textarea
                value={text}
                onChange={change}
                onFocus={event => event.currentTarget.select()}
                rows={5}
                className={`${props.customCss}`}
            />
        </div>
    )
}