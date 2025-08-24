import 'emoji-picker-element';

import { useRef, useEffect, createElement } from 'react';

function EmojiPicker(props) {
    const ref = useRef(null);

    // useEffect always runs after the first render, so the ref will be set
    useEffect(() => {
        if (ref.current) {
            ref.current.addEventListener('emoji-click', props.emojiSelectCallback);
        }
    }, []);

    return createElement('emoji-picker', { ref: ref });
}

export default EmojiPicker;