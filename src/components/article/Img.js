import { Node } from 'tiptap'

export default class Img extends Node {

  get name() {
    return 'img'
  }

  get schema() {
    return {
      attrs: {
        src: {
          default: null,
        },
      },
      group: 'block',
      selectable: false,
      parseDOM: [{
        tag: 'img',
        getAttrs: dom => ({
          src: dom.getAttribute('src'),
        }),
      }],
      toDOM: node => ['img', {
        src: node.attrs.src,
      }],
    }
  }

  get view() {
    return {
      props: ['node', 'updateAttrs', 'view'],
      computed: {
        src: {
          get() {
            return this.node.attrs.src
          },
          set(src) {
            this.updateAttrs({
              src,
            })
          },
        },
      },
      template: `
        <div style="text-align:center" class="img">
          <img class="iframe__embed_img" :src="src" ></img>
        </div>
      `,
    }
  }


  commands({ type }) {
    return attrs => (state, dispatch) => {
      const { selection } = state;
      const position = selection.$cursor
        ? selection.$cursor.pos
        : selection.$from.pos - 1;
      console.log(selection.$cursor)
      console.log(selection.$from.pos)
      const node = type.create({ src: attrs});
      const transaction = state.tr.insert(position, node);
      dispatch(transaction);
    };
  }

}
