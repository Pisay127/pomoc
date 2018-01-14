<?php

namespace Pomoc\Utils;


class Templating
{
    public static function render_fragment($fragment_filepath, $vars = array())
    {
        // {{ }}s are called vars (or variables).
        // {% %}s are called logics (singular would be logic). One {% %} is called a logic block, or simply a block.
        // TODO: Add syntax checking, like seriously.

        $fragment_content = file_get_contents($fragment_filepath);
        $fragment_content = self::replace_vars($fragment_content, $vars);
        self::execute_logics($fragment_content, $vars);

        return $fragment_content;
    }

    private static function replace_vars($fragment_content, $vars)
    {
        $content = "";
        $disregard_logic_block = false; // We have this variable outside the block because logic blocks encompasses
                                        // multiple lines while vars only reside in one line.
        $line_length = strlen($fragment_content);
        $grab_var = false;
        $var_name = "";
        for ($i = 0; $i < $line_length; $i++) {
            $char = $fragment_content[$i];

            if ($disregard_logic_block) {
                if ($char == "%" && $fragment_content[$i + 1] == "}") {
                    $disregard_logic_block = false;
                    $i++; // (comment_$i_increment)
                          // Here, we increment $i only by one cause at the end of the loop, we increment
                          // it again so we actually move the index two times forward instead of just one.

                    $content = $content."%}";
                } else {
                    $content = $content.$char;
                }
            } else if ($grab_var) {
                if ($char == "}" && $fragment_content[$i + 1] == "}") {
                    $content = $content.$vars[$var_name];

                    $grab_var = false;
                    $var_name = "";
                    $i++; // Read (comment_$i_increment).
                } else if (ctype_alnum($char) || $char == "_") {
                    $var_name = $var_name.$char;
                }
            } else {
                if ($char == "{" && $fragment_content[$i + 1] == "{") {
                    $grab_var = true;
                    $i++; // Read (comment_$i_increment).
                } else if ($char == "{" && $fragment_content[$i + 1] == "%") {
                    $disregard_logic_block = true;
                    $i++; // Read (comment_$i_increment).

                    $content = $content."{%";
                } else {
                    $content = $content.$char;
                }
            }
        }

        return $content;
    }

    private static function execute_logics($fragment_content, $vars)
    {
        $content = "";
        $logic = "";
        $grab_logic = false;
        $content_length = strlen($fragment_content);
        for ($i = 0; $i < $content_length; $i++) {
            $char = $fragment_content[$i];

            if ($grab_logic) {
                if ($char == "%" && $fragment_content[$i + 1] == "}") {
                    $grab_logic = false;
                    $i++;

                    // Execute code block
                    self::execute_block($logic, $vars);

                } else {
                    $logic = $logic.$char;
                }
            } else {
                if ($char == "{" && $fragment_content[$i + 1] == "%") {
                    $grab_logic = true;

                    $i++;
                } else {
                    $content = $content.$char;
                }
            }
        }
    }

    private static function execute_block($logic, &$vars)
    {
        // Dev note: I wanted to call the parameter $vars as $vars_pool cause it sounds cooler but
        //           then realized that $vars seems like a better fit and adding "_pool" is just
        //           redundant.

        $tokens = self::lex_block($logic);
        var_dump(self::parse_tokens($tokens));
    }

    private static function lex_block($logic)
    {
        $keywords = new SimpleSet();
        $keywords->add("if");
        $keywords->add("then");
        $keywords->add("elif");
        $keywords->add("endif");
        $keywords->add("output");

        $newline_token_deferrers = new SimpleSet();
        $newline_token_deferrers->add("\n");
        $newline_token_deferrers->add("then");

        $logic = trim($logic);
        $block_length = strlen($logic);
        $tokens = array();
        $line_is_comment = false;
        $i = 0;
        while ($i < $block_length) {
            $char = $logic[$i];

            if ($line_is_comment) {
                // We just encountered "//" earlier. We will consider everything before the next newline character
                // as part of a comment.
                if ($char == "\n") {
                    $line_is_comment = false;
                }

                $i++;
                continue;
            }

            if (ctype_alpha($char)) { $i = self::lex_read_char($logic, $block_length, $i, $tokens, $keywords); }
            else if ($char == "=") { $i = self::lex_read_equality_opr($logic, $block_length, $i, $tokens); }
            else if ($char == "'") { $i = self::lex_read_str_literal($logic, $block_length, $i, $tokens); }
            else if ($char == "\n" && !$newline_token_deferrers->contains(end($tokens)->getValue())) {
                $tokens[] = new Token(TokenType::SEPARATOR, "\n");
                $i++;
            }
            else if ($char == "/" && $logic[$i + 1] == "/") {
                $i += 2;
                $line_is_comment = true;
            }
            else { $i++; }
        }

        return $tokens;
    }

    private static function lex_read_char($logic, $block_length, $index, &$tokens, &$keywords)
    {
        $token = "";
        while ($index < $block_length && (ctype_alpha($logic[$index]) || $logic[$index] == "_")) {
            $token = $token.$logic[$index];
            $index++;
        }

        if ($token != "") {
            $token_type = null;
            if ($keywords->contains($token)) {
                $token_type = TokenType::KEYWORD;
            } else {
                $token_type = TokenType::IDENTIFIER;
            }

            $tokens[] = new Token($token_type, $token);
        }

        return $index;
    }

    private static function lex_read_equality_opr($logic, $block_length, $index, &$tokens)
    {
        $token = "";
        $num_equals = 0; // TODO: If this exceeds 2, raise an error.
        while ($index < $block_length && $num_equals < 3 && $logic[$index] == "=") {
            $token = $token."=";
            $index++;
            $num_equals++;
        }

        if ($token != "") {
            $tokens[] = new Token(TokenType::OPERATOR, $token);
        }

        return $index;
    }

    private static function lex_read_str_literal($logic, $block_length, $index, &$tokens)
    {
        $token = "'";
        $index++; // Move the index forward immediately since we know
                  // that the current index points to the first quotation.
        while ($index < $block_length && $logic[$index] != "'") {
            $token = $token.$logic[$index];
            $index++;
        }

        // TODO: Raise an error if the string didn't end with a quotation mark.
        if ($logic[$index] == "'") {
            $tokens[] = new Token(TokenType::LITERAL, $token."'");
            $index++; // Move the index forward because we do not
                      // want to read the ending quotation mark again
                      // back in lex_block(). Failing to do this will make
                      // our lexer treat the remaining code in the logic
                      // as a literal string.
        }

        return $index;
    }

    private static function parse_tokens(&$tokens)
    {
        $index = 0; // Indexes should initially be zero if you want to start from the first token.
        return self::parse($tokens, sizeof($tokens), $index);
    }

    private static function parse(&$tokens, $tokens_length, &$index)
    {
        $ast = array();
        while ($index < $tokens_length) {
            $token = $tokens[$index];

            if ($token->getType() == TokenType::IDENTIFIER) {
                array_push($ast, self::parse_identifier($tokens, $tokens_length, $index));
            } else if ($token->getType() == TokenType::KEYWORD) {
                if ($token->getValue() == "if") {
                    array_push($ast, self::parse_conditional($tokens, $tokens_length, $index));
                    $index++; // Move index forward so that it won't point to "endif":
                } else if ($token->getValue() == "output") {
                    array_push($ast, self::parse_output_func($tokens, $tokens_length, $index));
                } else if ($token->getValue() == "endif" || $token->getValue() == "elif") {
                    // We have reached the end of the nested statements. Time to return to the upper level.

                    return $ast;
                }
            } else {
                $index++;
            }
        }

        return $ast;
    }

    private static function parse_identifier(&$tokens, $tokens_length, &$index)
    {
        $ast_node = array(null);
        while ($index < $tokens_length) {
            if ($tokens[$index]->getType() == TokenType::SEPARATOR || $tokens[$index]->getValue() == "then") {
                break;
            }

            // TODO: Add syntax checking here.
            if ($tokens[$index]->getType() == TokenType::IDENTIFIER
                || $tokens[$index]->getType() == TokenType::LITERAL) {
                array_push($ast_node, $tokens[$index]->getValue());
            } else if ($tokens[$index]->getType() == TokenType::OPERATOR) {
                if ($tokens[$index]->getValue() == "=") {
                    $ast_node[0] = NodeOperation::ASSIGNMENT;
                } else if ($tokens[$index]->getValue() == "==") {
                    $ast_node[0] = NodeOperation::EQUALITY;
                }
            }

            $index++;
        }

        if ($ast_node[0] == null) {
            // Oh! It turns out that we just have a lonely (sad) identifier.
            $ast_node[0] = TokenType::IDENTIFIER;
        }

        return $ast_node;
    }

    private static function parse_conditional(&$tokens, $tokens_length, &$index)
    {
        $ast_node = array(NodeOperation::CONDITIONAL);
        $index++; // Move the index forward immediately cause we know the current token is the "if" token.
        array_push($ast_node, self::parse_identifier($tokens, $tokens_length, $index));

        $index++; // Move index so that we would no longer be pointing to the "then" token.

        array_push($ast_node, self::parse($tokens, $tokens_length, $index));

        if ($tokens[$index]->getValue() == "endif") {
            array_push($ast_node, null);
        } else if ($tokens[$index]->getValue() == "elif") {
            array_push($ast_node, self::parse_conditional($tokens, $tokens_length, $index));
        }

        return $ast_node;
    }

    private static function parse_output_func(&$tokens, $tokens_length, &$index)
    {
        $ast_node = array(NodeOperation::OUTPUT);
        $index++; // Move the index forward immediately cause we know the current token is the "Output" token.
        while ($index < $tokens_length) {
            if ($tokens[$index]->getType() == TokenType::SEPARATOR) {
                break;
            }

            if ($tokens[$index]->getType() == TokenType::LITERAL) {
                array_push($ast_node, $tokens[$index]->getValue());
                $index++; // Move the index forward so that it will point
                          // to the right token after running this function.

                break;
            } else if ($tokens[$index]->getType() == TokenType::IDENTIFIER) {
                array_push($ast_node, self::parse_identifier($tokens, $tokens, $index));
            }

            $index++;
        }

        return $ast_node;
    }
}

abstract class NodeOperation
{
    const ASSIGNMENT = 0;
    const EQUALITY = 1;
    const CONDITIONAL = 2;
    const OUTPUT = 3;
}

abstract class TokenType
{
    const IDENTIFIER = 0;
    const KEYWORD = 1;
    const SEPARATOR = 2;
    const OPERATOR = 3;
    const LITERAL = 4;
}

class Token
{
    private $type;
    private $value;

    public function __construct($type, $value)
    {
        $this->type = $type;
        $this->value = $value;
    }

    public function getType() { return $this->type; }
    public function getValue() { return $this->value; }

    public function __debugInfo()
    {
        $token_type_str = "";

        if ($this->type == TokenType::IDENTIFIER) {
            $token_type_str = "identifier";
        } else if ($this->type == TokenType::KEYWORD) {
            $token_type_str = "keyword";
        } else if ($this->type == TokenType::SEPARATOR) {
            $token_type_str = "separator";
        } else if ($this->type == TokenType::OPERATOR) {
            $token_type_str = "operator";
        } else if ($this->type == TokenType::LITERAL) {
            $token_type_str = "literal";
        }

        return array(
            "token_type" => $token_type_str,
            "token_value" => $this->value
        );
    }
}