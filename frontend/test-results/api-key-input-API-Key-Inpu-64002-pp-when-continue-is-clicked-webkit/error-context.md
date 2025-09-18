# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e4]:
      - generic [ref=e5]:
        - img [ref=e7]
        - generic [ref=e9]:
          - heading "RAG Chat" [level=1] [ref=e10]
          - paragraph [ref=e11]: AI-powered document chat
      - button "Settings" [ref=e13]:
        - img [ref=e14]
    - generic [ref=e17]:
      - generic [ref=e19] [cursor=pointer]:
        - button "Choose File" [ref=e20]
        - img [ref=e21] [cursor=pointer]
        - paragraph [ref=e24] [cursor=pointer]: Upload a PDF document
        - paragraph [ref=e25] [cursor=pointer]: Drag and drop or click to select a PDF file
      - generic [ref=e31]:
        - img [ref=e32]
        - heading "Start a conversation" [level=3] [ref=e34]
        - paragraph [ref=e35]: Upload a PDF document above to get started, or ask general questions.
      - generic [ref=e37]:
        - textbox "Type your message..." [ref=e38]
        - button [disabled]:
          - img
  - button "Open Next.js Dev Tools" [ref=e44] [cursor=pointer]:
    - img [ref=e45] [cursor=pointer]
  - alert [ref=e50]
```