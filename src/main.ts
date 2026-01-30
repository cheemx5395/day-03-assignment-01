import type { NewNote, Note } from "./types";
import { addNote, getNotes } from "./utils/utils";

// root element
const header = document.getElementById("header")!;
const root = document.getElementById("root")!;
const message = document.getElementById("message")!;
const createBtn = document.getElementById("createBtn")!;
const backBtn = document.getElementById("backBtn")!;
createBtn.addEventListener("click", () => {
    history.pushState({}, "", "/create");
    router();
});
backBtn.addEventListener("click", () => {
    history.pushState({}, "", "/");
    router();
});
window.addEventListener("popstate", router);

function createCard(note: Note): HTMLDivElement {
    const card = document.createElement("div");
    card.className =
        "cursor-pointer rounded-lg border border-gray-200 bg-white p-4 transition hover:shadow-sm";

    const title = document.createElement("h3");
    title.className = "text-sm font-medium text-gray-900 truncate";
    title.innerText = note.title;

    const timestamp = document.createElement("p");
    timestamp.className = "mt-1 text-xs text-gray-500";
    timestamp.innerText = note.createdAt;

    card.appendChild(title);
    card.appendChild(timestamp);

    card.addEventListener("click", () => {
        history.pushState({}, "", `/note/${note.id}`);
        router();
    });

    return card;
}


function formInput(
    name: string,
    labelClass: string,
    type: string,
    placeholder: string,
    inputClass: string,
    required: boolean
): [HTMLDivElement, HTMLInputElement] {
    const container = document.createElement("div");
    const label = document.createElement("label");
    const input = document.createElement("input");

    label.className = labelClass;
    label.setAttribute("for", name.toLowerCase());
    label.innerText = name;

    input.setAttribute("id", name.toLowerCase());
    input.setAttribute("type", type);
    input.setAttribute("placeholder", placeholder);
    input.className = inputClass;
    input.required = required;

    container.appendChild(label);
    container.appendChild(input);

    return [container, input];
}

function formTextArea(
    name: string,
    labelClass: string,
    rows: string,
    placeholder: string,
    textareaClass: string,
    required: boolean
): [HTMLDivElement, HTMLTextAreaElement] {
    const container = document.createElement("div");
    const label = document.createElement("label");
    const textarea = document.createElement("textarea");

    label.className = labelClass;
    label.setAttribute("for", name.toLowerCase());
    label.innerText = name;

    textarea.setAttribute("id", name.toLowerCase());
    textarea.setAttribute("rows", rows);
    textarea.setAttribute("placeholder", placeholder);
    textarea.className = textareaClass;
    textarea.required = required;

    container.appendChild(label);
    container.appendChild(textarea);

    return [container, textarea];
}

function formButton(
    text: string,
    type: string,
    btnClass: string
): HTMLButtonElement {
    const button = document.createElement("button");
    button.setAttribute("type", type);
    button.className = btnClass;
    button.innerText = text;

    return button;
}

function renderNotes() {
    backBtn.remove();
    header.appendChild(createBtn);

    root.innerHTML = "";
    // state
    const notes = getNotes();

    if (!notes) {
        message.innerText = "Get Started By Creating Your First Note";
    } else {
        message.innerText = "Your Notes";
        notes.forEach((note) => {
            const noteCard = createCard(note);
            root.appendChild(noteCard);
        });
    }
}

function createNote() {
    message.innerText = "New Note";
    createBtn.remove();
    header.appendChild(backBtn);

    // form state
    const state: NewNote = {
        title: "",
        description: "",
    };

    // state changer
    const setTitle = function (title: string) {
        state.title = title;
    };
    const setDescription = function (description: string) {
        state.description = description;
    };

    // render a form element
    const form = document.createElement("form");
    form.className = "w-full max-w-md mx-auto px-4 py-6 space-y-4";
    const [titleField, titleInput] = formInput(
        "Title",
        "block text-sm font-medium text-gray-700 mb-1",
        "text",
        "enter title here",
        "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400",
        true
    );
    const [descriptionField, descriptionInput] = formTextArea(
        "Description",
        "block text-sm font-medium text-gray-700 mb-1",
        "4",
        "enter description",
        "w-full rounded-md border border-gray-300 px-3 py-2 text-sm resize-none focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400",
        true
    );
    const submitBtn = formButton(
        "Add",
        "submit",
        "w-full rounded-md bg-gray-900 py-2.5 text-sm font-medium text-white transition active:scale-95 hover:bg-gray-800"
    );

    form.appendChild(titleField);
    form.appendChild(descriptionField);
    form.appendChild(submitBtn);

    root.innerHTML = "";
    root.appendChild(form);

    titleInput.addEventListener("input", () =>
        setTitle(titleInput.value.trim())
    );
    descriptionInput.addEventListener("input", () =>
        setDescription(descriptionInput.value.trim())
    );

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const titleText = titleInput.value.trim();
        if (!titleText) {
            alert("Title is required");
            return;
        }
        const descriptionText = descriptionInput.value.trim();
        if (!descriptionText) {
            alert("Description is required");
            return;
        }

        addNote(state);
        history.pushState({}, "", "/");
        router();
    });
}

function renderNoteDetail(noteId: string) {
    createBtn.remove();
    header.appendChild(backBtn);
    root.innerHTML = "";

    const notes = getNotes();
    const note = notes?.find((n) => String(n.id) === noteId);

    if (!note) {
        message.innerText = "Note not found";
        return;
    }

    message.innerText = note.title;

    const container = document.createElement("div");
    container.className =
        "max-w-md mx-auto px-4 py-6 space-y-4";

    const desc = document.createElement("p");
    desc.className = "text-sm text-gray-700 whitespace-pre-wrap";
    desc.innerText = note.description;

    const time = document.createElement("p");
    time.className = "text-xs text-gray-500";
    time.innerText = `Created at: ${note.createdAt}`;

    container.appendChild(desc);
    container.appendChild(time);

    root.appendChild(container);
}


function router() {
    const path = window.location.pathname;

    if (path === "/") {
        renderNotes();
        return;
    }

    if (path === "/create") {
        createNote();
        return;
    }

    if (path.startsWith("/note/")) {
        const id = path.split("/note/")[1];
        renderNoteDetail(id);
        return;
    }

    renderNotes();
}


router();
