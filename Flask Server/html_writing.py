""" This script is used for writing in HTML files

It adds links to HTML table.
It generates span tags for un/colored matching blocks.
It compares two text files
It inserts comparison results in corresponding html files

"""
from os import fsync, rename, path
from random import randint
from shutil import copy,copyfile
from tempfile import tempdir

from bs4 import BeautifulSoup as Bs
from tabulate import tabulate

from html_utils import get_color_from_similarity, get_real_matching_blocks, \
    blocks_list_to_strings_list, get_ordered_blocks_positions
from utils import is_float


def add_links_to_html_table(html_path: str) -> None:
    """ Add links to HTML data cells at specified path

    This method will link to all HTML TD tags which contain a float different from - 1 the
    corresponding HTML comparison file. The links will be opened in a new tab. The colors of
    the text in tag will change depending on similarity score.

    """

    with open(html_path, encoding='utf-8') as html:
        soup = Bs(html, 'html.parser')
        new_tag = Bs('<head><style>h2 {text-decoration: underline;font-family: arial, sans-serif;text-align: center;padding: 18px;font-size: 300%;}table {font-family: arial, sans-serif;border-collapse: collapse;width: 100%;}td, th {border: 1px solid black;font-weight: bold;text-align: center;padding: 14px;}</style></head><body><h2>Assignment Plagiarism Report</h2></body>','html.parser')
        soup.insert(0,new_tag)
        file_ind = 0  # Cursor on file number for the naming of html files

        for td_tag in soup.findAll('td'):  # Retrieve all data celss from html table in path

            if is_float(td_tag.text):  # If td is not filename or -1

                tmp = soup.new_tag('a',
                                   href='file:///' + html_path.replace('_results', str(file_ind)),
                                   target="_blank",
                                   style="color:" + get_color_from_similarity(td_tag.text))

                td_tag.string.wrap(tmp)  # We wrap the td string between the hyperlink
                file_ind += 1

        # We update the HTML of the file at path
        with open(html_path, 'wb') as f_output:
            f_output.write(soup.prettify("utf-8"))
            f_output.flush()
            fsync(f_output.fileno())
            f_output.close()
        # print(soup)

def get_span_blocks(bs_obj: Bs, text1: list, text2: list, block_size: int) -> list:
    """ Return list of spans with colors for HTML rendering """

    results = [[], []]  # List of spans list

    # Get matching blocks with chosen minimum size
    matching_blocks = get_real_matching_blocks(text1, text2, block_size)

    # Generate one unique color for each matching block
    colors = [f'#%06X' % randint(0, 0xFFFFFF) for _ in range(len(matching_blocks))]

    # Convert blocks from list of list of strings to list of strings
    string_blocks = [' '.join(map(str, text1[b.a:b.a + b.size])) for b in matching_blocks]

    # Store lengths of blocks in text
    strings_len_list = blocks_list_to_strings_list(matching_blocks, text1)

    # Convert list of strings to strings
    str1, str2 = ' '.join(map(str, text1)), ' '.join(map(str, text2))

    global_positions_list = [get_ordered_blocks_positions(str1, matching_blocks,
                                                          string_blocks),
                             get_ordered_blocks_positions(str2, matching_blocks,
                                                          string_blocks)]

    for num, pos_list in enumerate(global_positions_list):
        cursor = 0  # Cursor on current string

        if num == 1:  # Second iteration on second string
            str1 = str2

        for block in pos_list:
            # Span tag for the text before the matching sequence
            span = bs_obj.new_tag('span')
            span.string = str1[cursor:block[0]]

            # Span tag for the text in the matching sequence
            blockspan = bs_obj.new_tag('span',
                                       style="color:" + colors[block[1]] + "; font-weight:bold")
            blockspan.string = str1[block[0]:block[0] + strings_len_list[block[1]]]

            # Append spans tags to results list
            results[num].append(span)
            results[num].append(blockspan)

            # Update cursor position after last matching sequence
            cursor = block[0] + strings_len_list[block[1]]

        # End of loop, last span tag for the rest of the text
        span = bs_obj.new_tag('span')
        span.string = str1[cursor:]
        results[num].append(span)

    return results


def papers_comparison(save_dir: str, ind: int, text1: list, text2: list, filenames: tuple,
                      block_size: int) -> None:
    """ Write to HTML file texts that have been compared with highlighted similar blocks """

    # comp_path = path.join(save_dir, str(ind) + '.html')
    # print(comp_path)
    #par = 'D:\\Projects\\FYP\\studybuddy-plagiarism-checker\\templates\\template.html'
    par = 'C:\\Users\\HP\\Desktop\\EduCareer\\EduCareer\\Flask Server\\templates\\template.html'

    # par = r'C:\Users\user\Desktop\plag check projects\plagiarism_checker-wazzabeee\studybuddy-plagiarism-checker\templates\template.html'
    copy(par, save_dir)  # Copy comparison template to curr dir
    comp_path = path.join(save_dir, str(ind) + '.html')
    rename(path.join(save_dir, 'template.html'), comp_path)
    # print(comp_path)

    with open(comp_path, encoding='utf-8') as html:

        soup = Bs(html, 'html.parser')
        head = soup.head
        head.append(soup.new_tag('style', type='text/css'))
        head.style.append('h3 {text-align: center;text-decoration: underline;font-size: 150%;}.block {border: 2px solid black;padding: 10px;}')
        res = get_span_blocks(soup, text1, text2, block_size)
        blocks = soup.findAll(attrs={'class': 'block'})

        # Append filename tags and span tags to html
        for i, filename in enumerate(filenames):
            temp_tag = soup.new_tag('h3')
            temp_tag.string = filename
            blocks[i].append(temp_tag)
            for tag in res[i]:
                blocks[i].append(tag)

    with open(comp_path, 'wb') as f_output:
        f_output.write(soup.prettify("utf-8"))


def results_to_html(scores: list, files_names: list, html_path: str) -> None:
    """  Write similarity results to HTML page """
    for ind, _ in enumerate(files_names):
        scores[ind].insert(0, files_names[ind])

    scores.insert(0, files_names)
    scores[0].insert(0, '')

    # Custom CSS styles for the HTML table
    custom_css = """
        <head>
            <link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet">
            <style>
                body {
                    font-family: 'Poppins', sans-serif; /* Apply Poppins font to the whole document */
                }
            
                table {
                    width: 100%;
                    border-collapse: collapse;
                    border: 2px solid #dddddd;
                }
                th, td {
                    padding: 12px;
                    text-align: left;
                    border-bottom: 1px solid #dddddd;
                }
                th {
                    background-color: #2F6C6D;
                    font-weight: bold;
                    color: white; /* Added to match text color in React */
                }
                tr:hover {
                    background-color: #f5f5f5;
                }
                .bg-gray-100 {
                    background-color: #f5f5f5; /* Matching background color for even rows */
                }
                .bg-Teal { /* Changed to lowercase to match Tailwind CSS class */
                    background-color: #2F6C6D; /* Matching background color for header */
                }
                .text-3xl {
                    font-size: 24px; /* Matching font size */
                    margin-bottom: 10px; /* Matching margin */
                }
                .border-b {
                    border-bottom: 1px solid #dddddd; /* Matching border */
                }
                .border-r {
                    border-right: 1px solid #dddddd; /* Matching border */
                }
                .py-2 {
                    padding-top: 8px; /* Adjusted padding for consistency */
                    padding-bottom: 8px; /* Adjusted padding for consistency */
                }
                .px-4 {
                    padding-left: 16px; /* Adjusted padding for consistency */
                    padding-right: 16px; /* Adjusted padding for consistency */
                }
                .bg-Teal:hover {
                    background-color: #4a5568; /* Matching hover color */
                }
                .text-white {
                    color: white; /* Matching text color */
                }
            </style>
        </head>
    """

    # Write the HTML content with custom styles
    with open(html_path, 'w', encoding='utf-8') as file:
        file.write(custom_css)  # Apply custom CSS styles
        file.write(tabulate(scores, headers='firstrow', tablefmt='html'))
        file.flush()
        fsync(file.fileno())
        file.close()
