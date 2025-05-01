import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import LinkTextEditor from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { IconButton, Box, TextField, Button } from "@mui/material";
import {
  FormatBold,
  FormatItalic,
  FormatListBulleted,
  FormatListNumbered,
  FormatUnderlined,
  Link as LinkIcon,
  LinkOff as LinkOffIcon,
} from "@mui/icons-material";
import { useState, useRef, useEffect } from "react";
import "./SmallTextEditor.scss";

interface LinkPopupProps {
  editor: Editor;
  onClose: () => void;
}

// LinkPopup Component
const LinkPopup = ({ editor, onClose }: LinkPopupProps) => {
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleSave = () => {
    if (url && text) {
      editor.chain().focus();

      if (editor.state.selection.empty && text) {
        // Insert link with new content
        editor
          .chain()
          .insertContent(`<a href="${url}" target="_blank">${text}</a> `) // Space added here
          .run();
      } else {
        // Wrap selected text in a link
        const { from, to } = editor.state.selection;
        const selectedText = editor.state.doc.textBetween(from, to);

        editor
          .chain()
          .insertContentAt(
            { from, to },
            `<a href="${url}" target="_blank">${selectedText}</a> `,
          )
          .run();
      }

      // Move cursor outside the link and focus
      const { to } = editor.state.selection;
      editor.commands.setTextSelection(to + 2); // +2 to go after the inserted space
      editor.commands.focus();

      onClose(); // Close the link popup
    }
  };

  return (
    <Box
      ref={popupRef}
      className="link-popup"
      sx={{
        position: "absolute",
        top: "5px",
        left: "10px",
        backgroundColor: "white",
        padding: "5px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        zIndex: 11,
        display: "flex",
        gap: 2,
        alignItems: "flex-end",
      }}
    >
      <Box>
        {editor.state.selection.empty && (
          <TextField
            size="small"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter link text"
            sx={{
              width: "100%",
            }}
            slotProps={{
              htmlInput: {
                style: {
                  boxSizing: "border-box",
                  padding: "5px",
                },
              },
            }}
          />
        )}
        <TextField
          size="small"
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter url"
          sx={{
            width: "100%",
          }}
          slotProps={{
            htmlInput: {
              style: {
                boxSizing: "border-box",
                padding: "5px",
              },
            },
          }}
        />
      </Box>
      <Box>
        <Button
          variant="contained"
          onClick={handleSave}
          color="primary"
          className="!bg-primary !text-white hover:!bg-primary"
          size="small"
        >
          Save
        </Button>
      </Box>
    </Box>
  );
};

interface MenuBarProps {
  editor: Editor | null;
}

const MenuBar = ({ editor }: MenuBarProps) => {
  const [showLinkPopup, setShowLinkPopup] = useState<boolean>(false);

  if (!editor) return null;

  return (
    <Box
      className="menuBar"
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "end",
      }}
    >
      <IconButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "active" : ""}
      >
        <FormatBold className="!text-lg" />
      </IconButton>
      <IconButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "active" : ""}
      >
        <FormatItalic className="!text-lg" />
      </IconButton>
      <IconButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive("underline") ? "active" : ""}
      >
        <FormatUnderlined className="!text-lg" />
      </IconButton>
      <IconButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <FormatListBulleted className="!text-lg" />
      </IconButton>
      <IconButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <FormatListNumbered className="!text-lg" />
      </IconButton>
      <IconButton
        onClick={() => setShowLinkPopup(true)}
        className={editor.isActive("link") ? "active" : ""}
      >
        <LinkIcon className="!text-lg" />
      </IconButton>
      <IconButton
        onClick={() => editor.chain().focus().unsetLink().run()}
        disabled={!editor.isActive("link")}
      >
        <LinkOffIcon className="!text-lg" />
      </IconButton>
      {showLinkPopup && (
        <LinkPopup editor={editor} onClose={() => setShowLinkPopup(false)} />
      )}
    </Box>
  );
};

interface TextEditorProps {
  handleDescription: (content: string) => void;
  value: string;
  validationError?: string;
  customPlaceholder?: string;
}

export const SmallTextEditor = ({
  handleDescription,
  value,
  validationError,
  customPlaceholder,
}: TextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      LinkTextEditor.configure({ openOnClick: false }),
      Placeholder.configure({
        placeholder: customPlaceholder || "Write something …",
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      handleDescription(editor.getHTML());
    },
    editorProps: {
      handlePaste: (view, event) => {
        if (event.clipboardData?.files.length) {
          // Prevent pasting image files
          event.preventDefault();
          return true;
        }

        const text = event.clipboardData?.getData("text/html") || "";
        if (/<img\s/.test(text)) {
          // Prevent pasting images from HTML
          event.preventDefault();
          return true;
        }

        return false;
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <Box
      className="textEditor"
      sx={{ border: validationError ? "1px solid red" : "1px solid #c9cbce" }}
    >
      <EditorContent
        editor={editor}
        style={{
          maxHeight: "100px",
          overflowY: "auto",
        }}
      />
      <MenuBar editor={editor} />
    </Box>
  );
};
