import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { uploadImage } from './supabase';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Code,
  Link,
  Image,
  SplitSquareHorizontal,
  Maximize2,
  PanelLeft,
  PanelRight,
  Heading1,
  Heading2,
  Heading3,
  Strikethrough,
  Table,
  MinusSquare,
  CheckSquare,
  Type,
  Superscript,
  Subscript,
  Download,
  FileJson,
  Languages,
  Loader2,
} from 'lucide-react';

function App() {
  const [markdown, setMarkdown] = useState(`# مرحباً بك في محرر Markdown المحسّن

ابدأ الكتابة لترى المعاينة! إليك بعض الأمثلة على ما يمكنك فعله:

## تنسيق النص

يمكنك جعل النص **غامق**، *مائل*، أو ~~مشطوب~~.
يمكنك أيضًا استخدام ^نص مرتفع^ و~نص منخفض~.

## القوائم

1. عنصر القائمة المرتبة 1
2. عنصر القائمة المرتبة 2
   - نقطة متداخلة
   - نقطة متداخلة أخرى

## قوائم المهام

- [ ] مهمة للقيام بها
- [x] مهمة مكتملة

## الجداول

| الميزة | الدعم | ملاحظات |
|---------|---------|-------|
| الجداول | ✅ | مع المحاذاة |
| القوائم | ✅ | دعم التداخل |
| الكود | ✅ | مع تمييز بناء الجملة |

## الاقتباسات والكود

> هذا اقتباس
> يمكن أن يمتد على عدة أسطر

\`\`\`javascript
// هذا مثال على كتلة برمجية
function مرحبا() {
  console.log("مرحباً بالعالم!");
}
\`\`\`

## دعم الرياضيات

الرياضيات المضمنة: $E = mc^2$

كتلة رياضية:
$$
\\frac{1}{n} \\sum_{i=1}^{n} x_i
$$

---

!جرب كل هذه الميزات`);
  const [viewMode, setViewMode] = useState<'split' | 'editor' | 'preview'>('split');
  const [isRTL, setIsRTL] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      if (imageUrl) {
        insertText(`![${file.name}](${imageUrl})`);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const openImageUpload = () => {
    fileInputRef.current?.click();
  };

  const insertText = (before: string, after: string = '') => {
    const textarea = document.querySelector('textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.substring(start, end);
    const newText = markdown.substring(0, start) + before + selectedText + after + markdown.substring(end);
    setMarkdown(newText);

    setTimeout(() => {
      textarea.focus();
      const newPosition = start + before.length + selectedText.length + after.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const insertTable = () => {
    const tableTemplate = '\n| العنوان 1 | العنوان 2 | العنوان 3 |\n| -------- | -------- | -------- |\n| خلية 1   | خلية 2   | خلية 3   |\n';
    insertText(tableTemplate);
  };

  const exportMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportHtml = () => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="${isRTL ? 'ar' : 'en'}" dir="${isRTL ? 'rtl' : 'ltr'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exported Markdown</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
    <style>
        body {
            font-family: system-ui, -apple-system, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            color: #374151;
            direction: ${isRTL ? 'rtl' : 'ltr'};
            text-align: ${isRTL ? 'right' : 'left'};
        }
        pre {
            background: #f3f4f6;
            padding: 1rem;
            border-radius: 0.5rem;
            overflow-x: auto;
            direction: ltr;
            text-align: left;
        }
        code {
            font-family: ui-monospace, monospace;
            font-size: 0.9em;
            direction: ltr;
            text-align: left;
        }
        blockquote {
            border-${isRTL ? 'right' : 'left'}: 4px solid #e5e7eb;
            margin-${isRTL ? 'right' : 'left'}: 0;
            padding-${isRTL ? 'right' : 'left'}: 1rem;
            color: #6b7280;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 1rem 0;
        }
        th, td {
            border: 1px solid #e5e7eb;
            padding: 0.5rem;
            text-align: ${isRTL ? 'right' : 'left'};
        }
        th {
            background: #f9fafb;
        }
        img {
            max-width: 100%;
            height: auto;
        }
    </style>
</head>
<body>
    ${document.querySelector('.prose')?.innerHTML || ''}
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toolbar = [
    { icon: Type, action: () => insertText('# ', '\n'), tooltip: isRTL ? 'نص عادي' : 'Normal Text', group: 'text' },
    { icon: Heading1, action: () => insertText('# ', '\n'), tooltip: isRTL ? 'عنوان 1' : 'Heading 1', group: 'headings' },
    { icon: Heading2, action: () => insertText('## ', '\n'), tooltip: isRTL ? 'عنوان 2' : 'Heading 2', group: 'headings' },
    { icon: Heading3, action: () => insertText('### ', '\n'), tooltip: isRTL ? 'عنوان 3' : 'Heading 3', group: 'headings' },
    { icon: Bold, action: () => insertText('**', '**'), tooltip: isRTL ? 'غامق' : 'Bold', group: 'format' },
    { icon: Italic, action: () => insertText('*', '*'), tooltip: isRTL ? 'مائل' : 'Italic', group: 'format' },
    { icon: Strikethrough, action: () => insertText('~~', '~~'), tooltip: isRTL ? 'مشطوب' : 'Strikethrough', group: 'format' },
    { icon: Superscript, action: () => insertText('^', '^'), tooltip: isRTL ? 'مرتفع' : 'Superscript', group: 'format' },
    { icon: Subscript, action: () => insertText('~', '~'), tooltip: isRTL ? 'منخفض' : 'Subscript', group: 'format' },
    { icon: ListOrdered, action: () => insertText('1. '), tooltip: isRTL ? 'قائمة مرقمة' : 'Numbered List', group: 'lists' },
    { icon: List, action: () => insertText('- '), tooltip: isRTL ? 'قائمة نقطية' : 'Bullet List', group: 'lists' },
    { icon: CheckSquare, action: () => insertText('- [ ] '), tooltip: isRTL ? 'قائمة مهام' : 'Task List', group: 'lists' },
    { icon: Quote, action: () => insertText('> '), tooltip: isRTL ? 'اقتباس' : 'Quote', group: 'block' },
    { icon: Code, action: () => insertText('```\n', '\n```'), tooltip: isRTL ? 'كود برمجي' : 'Code Block', group: 'block' },
    { icon: MinusSquare, action: () => insertText('\n---\n'), tooltip: isRTL ? 'خط أفقي' : 'Horizontal Rule', group: 'block' },
    { icon: Table, action: insertTable, tooltip: isRTL ? 'جدول' : 'Table', group: 'block' },
    { icon: Link, action: () => insertText('[', '](url)'), tooltip: isRTL ? 'رابط' : 'Link', group: 'media' },
    { icon: Image, action: openImageUpload, tooltip: isRTL ? 'رفع صورة' : 'Upload Image', loading: isUploading, group: 'media' },
  ];

  const exportControls = [
    { icon: Download, action: exportMarkdown, tooltip: isRTL ? 'تصدير Markdown' : 'Export Markdown' },
    { icon: FileJson, action: exportHtml, tooltip: isRTL ? 'HTML تصدير' : 'Export HTML' },
  ];

  const viewControls = [
    { icon: SplitSquareHorizontal, mode: 'split', tooltip: isRTL ? 'عرض مقسم' : 'Split View' },
    { icon: PanelLeft, mode: 'editor', tooltip: isRTL ? 'المحرر فقط' : 'Editor Only' },
    { icon: PanelRight, mode: 'preview', tooltip: isRTL ? 'المعاينة فقط' : 'Preview Only' },
  ];

  const toolbarGroups = [
    { name: 'text', label: isRTL ? 'نص' : 'Text' },
    { name: 'headings', label: isRTL ? 'عناوين' : 'Headings' },
    { name: 'format', label: isRTL ? 'تنسيق' : 'Format' },
    { name: 'lists', label: isRTL ? 'قوائم' : 'Lists' },
    { name: 'block', label: isRTL ? 'كتل' : 'Blocks' },
    { name: 'media', label: isRTL ? 'وسائط' : 'Media' },
  ];

  return (
    <div className={`min-h-screen bg-gray-100 ${isRTL ? 'rtl' : 'ltr'}`}>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageUpload}
      />
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Maximize2 className="h-6 w-6 text-indigo-600" />
              <span className="ml-2 text-xl font-semibold">{isRTL ? 'محرر Markdown' : 'Markdown Editor'}</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsRTL(!isRTL)}
                className="p-2 rounded-md hover:bg-gray-100 text-gray-600 transition-colors flex items-center gap-2"
                title={isRTL ? 'تبديل اللغة' : 'Toggle Language'}
              >
                <Languages className="h-5 w-5" />
                <span className="text-sm">{isRTL ? 'English' : 'العربية'}</span>
              </button>
              <div className="flex space-x-2 border-r pr-4">
                {exportControls.map(({ icon: Icon, action, tooltip }) => (
                  <button
                    key={tooltip}
                    onClick={action}
                    className="p-2 rounded-md hover:bg-gray-100 text-gray-600 transition-colors"
                    title={tooltip}
                  >
                    <Icon className="h-5 w-5" />
                  </button>
                ))}
              </div>
              <div className="flex space-x-2">
                {viewControls.map(({ icon: Icon, mode, tooltip }) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode as 'split' | 'editor' | 'preview')}
                    className={`p-2 rounded-md hover:bg-gray-100 ${
                      viewMode === mode ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600'
                    }`}
                    title={tooltip}
                  >
                    <Icon className="h-5 w-5" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 py-2">
            {toolbarGroups.map(group => (
              <div key={group.name} className="flex items-center space-x-1">
                <div className="flex space-x-1">
                  {toolbar
                    .filter(item => item.group === group.name)
                    .map(({ icon: Icon, action, tooltip, loading }, index) => (
                      <button
                        key={index}
                        onClick={action}
                        className="p-2 rounded-md hover:bg-gray-100 text-gray-600 transition-colors disabled:opacity-50"
                        title={tooltip}
                        disabled={loading}
                      >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Icon className="h-5 w-5" />}
                      </button>
                    ))}
                </div>
                {group !== toolbarGroups[toolbarGroups.length - 1] && (
                  <div className="w-px h-6 bg-gray-200 mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Editor and Preview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className={`grid gap-6 h-[calc(100vh-12rem)] ${
          viewMode === 'split' ? 'grid-cols-2' : 'grid-cols-1'
        }`}>
          {(viewMode === 'split' || viewMode === 'editor') && (
            <div className="bg-white rounded-lg shadow-sm">
              <textarea
                className="w-full h-full p-4 resize-none focus:outline-none font-mono"
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                placeholder={isRTL ? "اكتب نص Markdown هنا..." : "Type your markdown here..."}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
          )}
          
          {(viewMode === 'split' || viewMode === 'preview') && (
            <div className={`bg-white rounded-lg shadow-sm p-4 overflow-auto prose prose-indigo max-w-none ${isRTL ? 'text-right' : 'text-left'}`}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
              >{markdown}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;