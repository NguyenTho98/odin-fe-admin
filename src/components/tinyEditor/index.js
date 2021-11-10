import React from "react";
import { Editor } from "@tinymce/tinymce-react";

import "tinymce/tinymce";
// Theme
import "tinymce/themes/silver";
import "tinymce/icons/default";
import "tinymce/skins/ui/oxide/skin.min.css";

// importing the plugin js.
import "tinymce/plugins/codesample";
import "tinymce/plugins/importcss";
import "tinymce/plugins/paste";
import "tinymce/plugins/directionality";
import "tinymce/plugins/visualblocks";
import "tinymce/plugins/visualchars";
import "tinymce/plugins/pagebreak";
import "tinymce/plugins/toc";
import "tinymce/plugins/imagetools";
import "tinymce/plugins/textpattern";
import "tinymce/plugins/noneditable";
// import "tinymce/plugins/quickbars";
import "tinymce/plugins/print";
import "tinymce/plugins/advlist";
import "tinymce/plugins/preview";
import "tinymce/plugins/autolink";
import "tinymce/plugins/link";
import "tinymce/plugins/image";
import "tinymce/plugins/lists";
import "tinymce/plugins/charmap";
import "tinymce/plugins/hr";
import "tinymce/plugins/anchor";
import "tinymce/plugins/searchreplace";
import "tinymce/plugins/wordcount";
import "tinymce/plugins/code";
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/insertdatetime";
import "tinymce/plugins/media";
import "tinymce/plugins/nonbreaking";
import "tinymce/plugins/table";
import "tinymce/plugins/template";
import "tinymce/plugins/help";

import "./TinyEditor.css";

const TinyEditor = (props) => {
  const {
    value = "",
    onChangeValue,
    height = 400,
    isDisabled = false,
    hideMenubar = false,
    hideToolbar = false,
  } = props;

  const handleOnChange = (value) => {
    if (onChangeValue) {
      onChangeValue(value);
    }
  };

  return (
    <Editor
      //  onInit={(evt, editor) => editorRef.current = editor}
      // apiKey="qagffr3pkuv17a8on1afax661irst1hbr4e6tbv888sz91jc"
      value={value}
      onEditorChange={handleOnChange}
      disabled={isDisabled}
      init={{
        menubar: !hideMenubar,
        height: height,
        codesample_global_prismjs: true,
        codesample_languages: codeSampleLanguages,
        plugins: [
          "print preview paste importcss searchreplace autolink directionality code visualblocks fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help",
        ],
        toolbar: hideToolbar
          ? ""
          : "fullscreen  preview | undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap | insertfile image media template link anchor codesample | ltr rtl",
        template_cdate_format: "[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]",
        template_mdate_format: "[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]",
        content_style: `body { font-family:Roboto; Helvetica,Arial,sans-serif; font-size:16px };`,
        content_css: [
          "/assets/tinymce/skin/default/content.min.css",
          "/assets/tinymce/skin/oxide/content.min.css",
          "/assets/prism/themes/prism.min.css",
        ],
      }}
    />
  );
};

export default TinyEditor;

const codeSampleLanguages = [
  { text: "HTML/XML", value: "markup" },
  { text: "XML", value: "xml" },
  { text: "HTML", value: "html" },
  { text: "CSS", value: "css" },
  { text: "Javascript", value: "javascript" },
  { text: "aspnet", value: "aspnet" },
  { text: "bash", value: "bash" },
  { text: "basic", value: "basic" },
  { text: "C", value: "c" },
  { text: "C#", value: "csharp" },
  { text: "C++", value: "cpp" },
  { text: "ruby", value: "ruby" },
  { text: "go", value: "go" },
  { text: "java", value: "java" },
  { text: "JSON", value: "json" },
  { text: "kotlin", value: "kotlin" },
  { text: "less", value: "less" },
  { text: "nginx", value: "nginx" },
  { text: "objectivec", value: "objectivec" },
  { text: "perl", value: "perl" },
  { text: "PHP", value: "php" },
  { text: "pure", value: "pure" },
  { text: "python", value: "python" },
  { text: "sass", value: "sass" },
  { text: "scss", value: "scss" },
  { text: "SQL", value: "sql" },
  { text: "swift", value: "swift" },
  { text: "TypeScript", value: "typescript" },
  { text: "YAML", value: "yaml" },
];
