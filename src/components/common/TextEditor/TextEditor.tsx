import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import LinkTextEditor from "@tiptap/extension-link";
import ImageResize from "tiptap-extension-resize-image";
import {
  IconButton,
  MenuItem,
  Select,
  Box,
  TextField,
  Button,
  SelectChangeEvent,
} from "@mui/material";
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  StrikethroughS,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  Image as ImageIcon,
  Link as LinkIcon,
  LinkOff as LinkOffIcon,
} from "@mui/icons-material";
import { useState, useRef, useEffect } from "react";
import "./TextEditor.scss";

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
    if (url) {
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
    <div
      ref={popupRef}
      className="link-popup"
      style={{
        position: "absolute",
        width: "300px",
        top: "40px",
        left: "10px",
        backgroundColor: "white",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        zIndex: 11,
      }}
    >
      {editor.state.selection.empty && (
        <TextField
          size="small"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter link text"
          sx={{
            marginBottom: "10px",
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
          marginBottom: "10px",
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
      <Button
        variant="outlined"
        color="secondary"
        onClick={onClose}
        size="small"
      >
        Cancel
      </Button>
      <Button
        variant="outlined"
        onClick={handleSave}
        color="primary"
        sx={{ marginLeft: "10px" }}
        size="small"
      >
        Save
      </Button>
    </div>
  );
};

interface MenuBarProps {
  editor: Editor | null;
  addHeadings?: boolean;
}

// MenuBar Component
const MenuBar = ({ editor, addHeadings }: MenuBarProps) => {
  const [showLinkPopup, setShowLinkPopup] = useState<boolean>(false);

  if (!editor) return null;

  const addImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          editor
            .chain()
            .focus()
            .setImage({ src: imageUrl })
            .createParagraphNear()
            .run();
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleHeadingChange = (event: SelectChangeEvent<string>) => {
    const level = event.target.value;
    if (level === "paragraph") {
      editor.chain().focus().setParagraph().run();
    } else {
      // Convert the level to a number and assert it as `Level`
      const headingLevel = parseInt(level, 10) as 1 | 2 | 3 | 4 | 5 | 6;
      editor.chain().focus().toggleHeading({ level: headingLevel }).run();
    }
  };

  return (
    <Box className="menuBar sticky top-0 z-50 flex items-center border-b border-gray-300 bg-white">
      {addHeadings && (
        <Select
          defaultValue="paragraph"
          onChange={handleHeadingChange}
          size="small"
          sx={{ ml: 1, border: "none" }}
        >
          <MenuItem value="paragraph">Paragraph</MenuItem>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <MenuItem key={n} value={n}>{`Heading ${n}`}</MenuItem>
          ))}
        </Select>
      )}
      <IconButton onClick={() => editor.chain().focus().toggleBold().run()}>
        <FormatBold className="!text-lg" />
      </IconButton>
      <IconButton onClick={() => editor.chain().focus().toggleItalic().run()}>
        <FormatItalic className="!text-lg" />
      </IconButton>
      <IconButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <FormatUnderlined className="!text-lg" />
      </IconButton>
      <IconButton onClick={() => editor.chain().focus().toggleStrike().run()}>
        <StrikethroughS className="!text-lg" />
      </IconButton>
      <IconButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <FormatQuote className="!text-lg" />
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
      <IconButton onClick={() => setShowLinkPopup(true)}>
        <LinkIcon className="!text-lg" />
      </IconButton>
      <IconButton
        onClick={() => editor.chain().focus().unsetLink().run()}
        disabled={!editor.isActive("link")}
      >
        <LinkOffIcon className="!text-lg" />
      </IconButton>
      <IconButton onClick={addImage}>
        <ImageIcon className="!text-lg" />
      </IconButton>
      {showLinkPopup && (
        <LinkPopup editor={editor} onClose={() => setShowLinkPopup(false)} />
      )}
    </Box>
  );
};

interface TextEditorProps {
  handleDescription: (content: string) => void;
  addHeadings?: boolean;
  value: string;
}

// Tiptap Component
export const TextEditor = ({
  handleDescription,
  addHeadings,
  value,
}: TextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageResize,
      Underline,
      LinkTextEditor.configure({ openOnClick: false }),
      ImageResize.configure({ allowBase64: true }), // Enable Base64 support
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      handleDescription(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <Box className="textEditor overflow-y-auto rounded-md border border-gray-400">
      <MenuBar editor={editor} addHeadings={addHeadings} />
      <EditorContent editor={editor} />
    </Box>
  );
};
