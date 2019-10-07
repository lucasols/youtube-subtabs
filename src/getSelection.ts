(() => {
  console.log('save-in-phrasebook v1.0.0');

  let url = 'https://lucassantos.net/phrasebook/';

  // code goes here
  const sel = window.getSelection();

  if (sel) {
    const selection = sel && sel.toString();

    // Detect if selection is backwards
    const range = document.createRange();
    if (sel.anchorNode) range.setStart(sel.anchorNode, sel.anchorOffset);
    if (sel.focusNode) range.setEnd(sel.focusNode, sel.focusOffset);
    const backwards = range.collapsed;
    range.detach();

    // modify() works on the focus of the selection
    const endNode = sel.focusNode;
    const endOffset = sel.focusOffset;
    sel.collapse(sel.anchorNode, sel.anchorOffset);

    let direction: string[] = [];
    if (backwards) {
      direction = ['backward', 'forward'];
    } else {
      direction = ['forward', 'backward'];
    }

    sel.modify('move', direction[0], 'character');
    sel.modify('move', direction[1], 'sentence');
    if (endNode) sel.extend(endNode, endOffset);
    sel.modify('extend', direction[1], 'character');
    sel.modify('extend', direction[0], 'sentence');

    const sentence = sel.toString();

    if (selection && sentence) {
      url = `https://lucassantos.net/phrasebook/?front=${encodeURI(
        selection,
      )}&sentence=${encodeURI(sentence)}`;
    }
  }

  return url;
})();
