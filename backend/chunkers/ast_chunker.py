import ast


def ast_chunk_python(text: str) -> list[dict]:
    """
    Parse Python source code into an AST and chunk by top-level nodes
    (functions, classes, imports, assignments, etc.). Each top-level
    statement becomes its own chunk, preserving the logical structure
    of the code.
    """
    try:
        tree = ast.parse(text)
    except SyntaxError as e:
        raise ValueError(f"Invalid Python syntax: {e}")

    lines = text.splitlines(keepends=True)

    chunks = []
    for i, node in enumerate(ast.iter_child_nodes(tree)):
        start_line = node.lineno - 1
        end_line = node.end_lineno

        chunk_text = "".join(lines[start_line:end_line])
        char_start = sum(len(l) for l in lines[:start_line])
        char_end = char_start + len(chunk_text)

        label = _node_label(node)
        chunks.append({
            "text": chunk_text,
            "start": char_start,
            "end": char_end,
            "index": i,
            "node_type": label,
        })

    return chunks


def _node_label(node: ast.AST) -> str:
    """Produce a human-readable label for an AST node."""
    if isinstance(node, ast.FunctionDef):
        return f"function: {node.name}"
    if isinstance(node, ast.AsyncFunctionDef):
        return f"async function: {node.name}"
    if isinstance(node, ast.ClassDef):
        return f"class: {node.name}"
    if isinstance(node, (ast.Import, ast.ImportFrom)):
        return "import"
    if isinstance(node, ast.Assign):
        targets = ", ".join(ast.dump(t) for t in node.targets)
        return f"assignment"
    if isinstance(node, ast.Expr) and isinstance(node.value, (ast.Constant, ast.JoinedStr)):
        return "docstring/expression"
    return type(node).__name__
