<template>
  <div class="editor">
    <editor-menu-bubble :editor="editor" :keep-in-bounds="keepInBounds" v-slot="{ commands, isActive, menu }">
      <div
        class="menububble"
        :class="{ 'is-active': menu.isActive }"
        :style="`left: ${menu.left}px; bottom: ${menu.bottom}px;`"
      >
          <button
            :class="{ 'is-active': isActive.bold() }"
            class="menububble__button"
            @click="commands.bold"
          >
            <v-icon dark>mdi-format-bold</v-icon>
          </button>

          <button
            :class="{ 'is-active': isActive.italic() }"
            class="menububble__button"
            @click="commands.italic"
          >
            <v-icon dark>mdi-format-italic</v-icon>
          </button>

          <button
            :class="{ 'is-active': isActive.strike() }"
            class="menububble__button"
            @click="commands.strike"
          >
            <v-icon dark>mdi-format-strikethrough</v-icon>
          </button>

          <button
            :class="{ 'is-active': isActive.underline() }"
            class="menububble__button"
            @click="commands.underline"
          >
            <v-icon dark>mdi-format-underline</v-icon>
          </button>

          <button
            :class="{ 'is-active': isActive.code() }"
            class="menububble__button"
            @click="commands.code"
          >
            <v-icon dark>mdi-xml</v-icon>
          </button>

          <button
            class="menububble__button"
            @click="commands.horizontal_rule"
          >
            <v-icon dark>mdi-minus</v-icon>
          </button>

          <button
            :class="{ 'is-active': isActive.heading({ level: 1 }) }"
            class="menububble__button"
            @click="commands.heading({ level: 1 })"
          >
            <v-icon dark>mdi-format-header-1</v-icon>
          </button>

          <button
            :class="{ 'is-active': isActive.heading({ level: 2 }) }"
            class="menububble__button"
            @click="commands.heading({ level: 2 })"
          >
            <v-icon dark>mdi-format-header-2</v-icon>
          </button>

          <button
            :class="{ 'is-active': isActive.heading({ level: 3 }) }"
            class="menububble__button"
            @click="commands.heading({ level: 3 })"
          >
            <v-icon dark>mdi-format-header-3</v-icon>
          </button>

          <button
            :class="{ 'is-active': isActive.bullet_list() }"
            class="menububble__button"
            @click="commands.bullet_list"
          >
            <v-icon dark>mdi-format-list-bulleted-square</v-icon>
          </button>

          <button
            :class="{ 'is-active': isActive.ordered_list() }"
            class="menububble__button"
            @click="commands.ordered_list"
          >
            <v-icon dark>mdi-format-list-numbered</v-icon>
          </button>

          <button
            :class="{ 'is-active': isActive.blockquote() }"
            class="menububble__button"
            @click="commands.blockquote"
          >
            <v-icon dark>mdi-format-quote-close</v-icon>
          </button>

          <button
            class="menububble__button"
            @click="commands.undo"
          >
            <v-icon dark>mdi-undo</v-icon>
          </button>

          <button
            class="menububble__button"
            @click="commands.redo"
          >
            <v-icon dark>mdi-redo</v-icon>
          </button>
      </div>
    </editor-menu-bubble>
    <editor-content class="editor__content" :editor="editor" />
  </div>
</template>

<script>
    import { mapMutations, mapActions  } from 'vuex';
    import {
    Blockquote,
    CodeBlock,
    HardBreak,
    Heading,
    HorizontalRule,
    OrderedList,
    BulletList,
    ListItem,
    TodoItem,
    TodoList,
    Bold,
    Code,
    Italic,
    Link,
    Strike,
    Underline,
    History,
    TrailingNode
    } from 'tiptap-extensions'
    import { Editor, EditorContent, EditorMenuBubble } from 'tiptap'

    export default {
        components: {
        EditorMenuBubble,
        EditorContent,
        },
        props: {
          text: {
              type: String,
              default: ''
          }
        },
        data: _ => ({
            keepInBounds: true,
            editor: new Editor({
            autoFocus: true,
            extensions: [
                new Blockquote(),
                new BulletList(),
                new CodeBlock(),
                new HardBreak(),
                new Heading({ levels: [1, 2, 3] }),
                new HorizontalRule(),
                new ListItem(),
                new OrderedList(),
                new TodoItem(),
                new TodoList(),
                new Link(),
                new Bold(),
                new Code(),
                new Italic(),
                new Strike(),
                new Underline(),
                new History(),
                new TrailingNode(),
            ],
            content: ''
            }),
        }),
        created: function() {
        var unwatch = this.$watch('text', function (newVal) {
              this.editor.setContent(newVal)
              if(unwatch){
                unwatch()
              }
              // this.setEditorText(this.textData)
          },{
            immediate: true
          })
        this.editor.on('update', ({ getHTML }) => {
            // this.setEditorText(getHTML())
            this.$emit('update:text', getHTML())
        })
        },
        beforeDestroy () {
        this.setEditorText("")
        this.editor.destroy()
        },
        methods: {
        ...mapMutations(['setEditorText']),
        }
    }
</script>

<style lang="scss">
  .editor__content {
    font-size: 1.5em;
    font-family: 'Times New Roman', Times, serif;
    line-height: 1.5;
    text-align: justify;

    & h1, h2, h3 {
      margin-bottom: 1em;
    }
  }
  .ProseMirror {
    // outline: none;
  }
  .menububble {
    position: absolute;
    display: flex;
    z-index: 20;
    flex-wrap: wrap;
    background: black;
    border-radius: 5px;
    padding: 0.3rem;
    margin-bottom: 0.5rem;
    transform: translateX(-50%);
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.2s, visibility 0.2s;

    &.is-active {
      opacity: 1;
      visibility: visible;
    }
    &__button {
      display: inline-flex;
      background: transparent;
      border: 0;
      color: white;
      padding: 0.2rem 0.5rem;
      margin-right: 0.2rem;
      border-radius: 3px;
      cursor: pointer;
      &:last-child {
        margin-right: 0;
      }
      &:hover {
        background-color: rgba(white, 0.1);
      }
      &.is-active {
        background-color: rgba(white, 0.2);
      }
    }
    &__form {
      display: flex;
      align-items: center;
    }
    &__input {
      font: inherit;
      border: none;
      background: transparent;
      color: white;
    }
  }
</style>