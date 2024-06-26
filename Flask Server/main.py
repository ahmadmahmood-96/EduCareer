#!/usr/bin/env python
""" This module launches the files comparison process

This modules compares all txt, docs, odt, pdf files present in path specified.
It writes results in a HTML table.
It uses difflib library to find matching sequences.
It can also use Jaccard Similarity, words counting, overlapping words for similarity

"""
import sys
import webbrowser
from datetime import datetime
from os import listdir, path

from html_writing import add_links_to_html_table, results_to_html, papers_comparison
from html_utils import writing_results
from processing_files import file_extension_call
from similarity import difflib_overlap
from utils import wait_for_file, get_student_names, parse_options


def main() -> None:
    
    in_dir = 'C:\\Users\\Dell\\Desktop\\EduCareer\\Flask Server\\input'
    out_dir = 'C:\\Users\\Dell\\Desktop\\EduCareer\\Flask Server\\results'
    
    block_size = 2
   
    if path.exists(in_dir):  # Check if specified path exists
        
        if len(listdir(in_dir)) > 1:  # Check if there are at least 2 files at specified path
            filenames, processed_files = [], []
            students_names = get_student_names(in_dir)
           
            for ind, direc in enumerate(listdir(in_dir)):
                # print(path.join(in_dir, direc))
                # if path.isdir(path.join(in_dir, direc)):
                #     print('hi')
                #     for file in listdir(path.join(in_dir, direc)):
                #         # print(file)
                #         file_words = file_extension_call(in_dir + '\\' + direc + '\\' + file)

                #         if file_words:  # If all files have supported format
                #             processed_files.append(file_words)
                #             filenames.append(students_names[ind])
                #         else:  # At least one file was not supported
                #             print(
                #                 "Remove files which are not txt, pdf, docx or odt and run the "
                #                 "script again.")
                #             sys.exit()
               
                

                # for file in listdir(in_dir):
                    # print(file)
                    # print(in_dir)
                
                # if(count>=length):
                #     break
                gov = path.join(in_dir,direc)
                
                
                # file_words = file_extension_call(in_dir + '\\' + direc + '\\' + file)
                file_words = file_extension_call(gov)
                # print(file_words)

                if file_words:  # If all files have supported format
                    processed_files.append(file_words)
                    filenames.append(students_names[ind])
                else:  # At least one file was not supported
                    print(
                        "Remove files which are not txt, pdf, docx or odt and run the "
                        "script again.")
                    sys.exit()
                # filenames = sorted(set(filenames))
                # if path.isdir(in_dir):
                #     for file in listdir(in_dir):
                #         # print(file)
                #         gov = path.join(in_dir, direc)
                #         # file_words = file_extension_call(in_dir + '\\' + direc + '\\' + file)
                #         file_words = file_extension_call(gov)
              
                #         if file_words:  # If all files have supported format
                #             processed_files.append(file_words)
                #             filenames.append(students_names[ind])
                #         else:  # At least one file was not supported
                #             print(
                #                 "Remove files which are not txt, pdf, docx or odt and run the "
                #                 "script again.")
                #             sys.exit()

            if out_dir is not None and path.exists(out_dir):
                results_directory = out_dir
            else:
                # Create new directory for storing html files
                results_directory = writing_results(datetime.now().strftime("%Y%m%d_%H%M%S"))
            # print(students_names)
            difflib_scores = [[] for _ in range(len(processed_files))]
            file_ind = 0
            for i, text in enumerate(processed_files):
                for j, text_bis in enumerate(processed_files):
                    if i != j:
                        # Append to the list the similarity score between text and text_bis
                        difflib_scores[i].append(difflib_overlap(text, text_bis))

                        # Write text with matching blocks colored in results directory
                        papers_comparison(results_directory, file_ind, text, text_bis,
                                          (filenames[i], filenames[j]), block_size)
                        file_ind += 1
                    else:
                        difflib_scores[i].append(-1)

            results_directory = path.join(results_directory, '_results.html')
            # print(in_dir)
            # print(results_directory)
            # print(processed_files)

            results_to_html(difflib_scores, filenames, results_directory)

            if wait_for_file(results_directory, 60):  # Wait for file to be created
                add_links_to_html_table(results_directory)
                webbrowser.open(results_directory)  # Open results HTML table
            else:
                print("Results file was not created...")
        else:
            print(
                "Minimum number of files is not present. Please check that there are at least "
                "two files to compare.")
            sys.exit()
    else:
        print("The specified path does not exist : " + in_dir)
        sys.exit()


if __name__ == '__main__':
    main()
