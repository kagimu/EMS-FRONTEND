<script setup>
import { onMounted, ref, watch, nextTick } from "vue";
import useCommonsStore from "@/composables/useCommons.js";

const commentTextEditor = ref(null);
const comment = ref('');
const hasProcessed = ref(false);
const monitorPhraseUpdate = ref(false);
const commons = useCommonsStore();

const emits = defineEmits(["update:textResponse"]);
const props = defineProps({
  contenteditable: String,
  textAreaMinHeight: String,
  noBoarder: String,
  textInfo: String
});

const cursorSelection = ref(null);

onMounted(() => {
  checkDraft();
});

watch(() => props.textInfo, (data) => {
  if (data) checkDraft();
});

watch(comment, (newVal) => {
  emits("update:textResponse", newVal);
});

const checkDraft2 = () => {
  if (props.textInfo && props.textInfo.length > 0 && !hasProcessed.value) {
    hasProcessed.value = true;
    comment.value = props.textInfo;
    // commentTextEditor.value.innerHTML = commons.commentAlteration(props.textInfo);
  }
};


watch(() => props.textInfo, () => {
  checkDraft()
})

const checkDraft = () => {
  if (props.textInfo && !monitorPhraseUpdate.value) {
    comment.value = props.textInfo || ''
    commentTextEditor.value.innerHTML = commons.commentAlteration(props.textInfo);
    monitorPhraseUpdate.value = true
  }
}



const onInputChange = (event) => {
  comment.value = event.target.innerHTML;
};

const focusCommentBox = () => {
  commentTextEditor.value.focus();
};

const clearCommentBox = () => {
  commentTextEditor.value.innerHTML = "";
  comment.value = "";
};

const storeCursor = () => {
  const sel = window.getSelection();
  if (sel && sel.rangeCount > 0) {
    cursorSelection.value = sel.getRangeAt(0);
  }
};

const execCommand = (command, value = null) => {
  // commentTextEditor.value?.focus()
  document.execCommand(command, false, value)
}

const execCommands = (command, value = null) => {
  // commentTextEditor.value?.focus();
  if (value) {
    document.execCommand(command, false, value);
  } else {
    document.execCommand(command);
  }
  comment.value = commentTextEditor.value.innerHTML;
};


const insertAtCursor = (text) => {
  // commentTextEditor.value.focus();
  nextTick(() => {
    const sel = window.getSelection();
    if (cursorSelection.value) {
      sel.removeAllRanges();
      sel.addRange(cursorSelection.value);
    }

    const range = sel.getRangeAt(0);
    const node = document.createTextNode(" " + text + " ");
    range.deleteContents();
    range.insertNode(node);
    range.setStartAfter(node);
    range.setEndAfter(node);
    sel.removeAllRanges();
    sel.addRange(range);
    comment.value = commentTextEditor.value.innerHTML;
  });
};

defineExpose({
  focusCommentBox,
  clearCommentBox,
  insertAtCursor
});




const addLink = () => {
  const url = prompt("Enter the URL")
  if (url) {
    execCommand("createLink", url)
  }
}


</script>


<template>
  <div>
    <!-- Toolbar -->
<!--    <div class="flex flex-wrap gap-2 items-center mb-2 text-sm">-->
<!--      <button class="tool-btn" @click.prevent="execCommand('bold')"><b>B</b></button>-->
<!--      <button class="tool-btn" @click.prevent="execCommand('italic')"><i>I</i></button>-->
<!--      <button class="tool-btn" @click.prevent="execCommand('underline')"><u>U</u></button>-->
<!--      <button class="tool-btn" @click.prevent="execCommand('formatBlock', 'p')">P</button>-->
<!--      <button class="tool-btn" @click.prevent="execCommand('formatBlock', 'h3')">H3</button>-->

<!--      <select @change="execCommand('fontSize', $event.target.value)" class="tool-select">-->
<!--        <option value="3">Font Size</option>-->
<!--        <option value="1">Small</option>-->
<!--        <option value="3">Normal</option>-->
<!--        <option value="5">Large</option>-->
<!--        <option value="7">Huge</option>-->
<!--      </select>-->

<!--      <label class="tool-label">-->
<!--        <span>Text Color</span>-->
<!--        <input type="color" @input="execCommand('foreColor', $event.target.value)" />-->
<!--      </label>-->

<!--     -->
<!--      <label class="tool-label">-->
<!--        <span>Highlight</span>-->
<!--        <input type="color" @input="execCommand('hiliteColor', $event.target.value)" />-->
<!--      </label>-->
<!--    </div>-->

    <div class="editor-toolbar flex flex-wrap items-center gap-2 mb-2 text-sm">

      <!-- Heading Dropdown -->
      <select @change="execCommand('formatBlock', $event.target.value)" class="editor-control">
        <option value="">Normal</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
        <option value="p">Paragraph</option>
      </select>

      <!-- Font Size -->
      <select @change="execCommand('fontSize', $event.target.value)" class="editor-control">
        <option value="2">Small</option>
        <option value="3">Normal</option>
        <option value="4">Large</option>
        <option value="5">X-Large</option>
      </select>

      <!-- Bold / Italic / Underline -->
      <button type="button" @click="execCommand('bold')" class="editor-btn">B</button>
      <button type="button" @click="execCommand('italic')" class="editor-btn italic">I</button>
      <button type="button" @click="execCommand('underline')" class="editor-btn underline">U</button>

      <!-- Font Color -->
      <label class="tool-label">
        <span>A</span>
        <input type="color" @input="execCommand('foreColor', $event.target.value)" />
      </label>

      <!-- Background Color -->
      <label class="tool-label">
        <span class="bg-icon">Bg</span>
        <input type="color" @input="execCommand('hiliteColor', $event.target.value)" />
      </label>

      <!-- Alignment -->
      <button type="button" @click="execCommand('justifyLeft')" class="editor-btn">Left</button>
      <button type="button" @click="execCommand('justifyCenter')" class="editor-btn">Center</button>
      <button type="button" @click="execCommand('justifyRight')" class="editor-btn">Right</button>

      <!-- Lists -->
      <button type="button" @click="execCommand('insertUnorderedList')" class="editor-btn">• List</button>
      <button type="button" @click="execCommand('insertOrderedList')" class="editor-btn">1. List</button>

      <!-- Link -->
      <button type="button" @click="addLink" class="editor-btn">🔗 Link</button>

      <!-- Undo/Redo -->
      <button type="button" @click="execCommand('undo')" class="editor-btn">↺ Undo</button>
      <button type="button" @click="execCommand('redo')" class="editor-btn">↻ Redo</button>

      <!-- Clear formatting -->
      <button type="button" @click="execCommand('removeFormat')" class="editor-btn">Clear</button>
    </div>

    <!-- Editable Text Area -->
    <div
        ref="commentTextEditor"
        :class="[noBoarder ? '' : 'border rounded-xl']"
        class="bg-white p-[10px] text-[#4c5663] text-[14px] focus:outline-none shadow-none"
        :style="textAreaMinHeight ? textAreaMinHeight : 'min-height: 250px;'"
        :contenteditable="contenteditable ?? 'true'"
        @input="onInputChange"
        @click="storeCursor"
        @keyup="storeCursor"
        @mouseup="storeCursor"
    ></div>
  </div>
</template>

<style scoped>
.tool-btn {
  background-color: #f3f4f6;
  border: 1px solid #ccc;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}
.tool-btn:hover {
  background-color: #dbeafe;
}

.tool-select {
  border: 1px solid #ccc;
  padding: 3px 5px;
  border-radius: 4px;
  font-size: 13px;
}
.tool-label {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: #f9fafb;
  border: 1px solid #ccc;
  padding: 3px 6px;
  border-radius: 4px;
  font-size: 13px;
}
.tool-label span {
  font-size: 12px;
  color: #374151;
}

.editor-toolbar {
  background: #f9fafb;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ddd;
}
.editor-btn {
  padding: 4px 8px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
}
.editor-btn:hover {
  background-color: #e5e7eb;
}
.editor-control {
  padding: 4px;
  font-size: 13px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.tool-label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 2px 5px;
}
.bg-icon {
  background-color: #ccc;
  padding: 0 4px;
}
</style>

