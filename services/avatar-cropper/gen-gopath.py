import os

if __name__ == '__main__':
    service_dir = os.path.dirname(os.path.realpath(__file__))

    try:
        gopath_exists = True
        gopath = os.environ['GOPATH']
    except KeyError:
        os.environ['GOPATH'] = ''
        gopath_exists = False
    finally:
        newpath_prefix = ''
        if gopath_exists:
            newpath_prefix = ':'

        os.environ['GOPATH'] += '{0}{1}'.format(newpath_prefix, service_dir)

    host_os = os.name
    if host_os == 'posix':  # For UNIX systems (e.g. Linux, macOS)
        print(' [*] Generating export command file... ', end='')

        shell_command_filepath = '{0}/set-gopath.sh'.format(service_dir)
        shell_command_file = open(shell_command_filepath, 'w+')
        shell_command_file.write('# This file is auto-generated. Do not modify unless you know what you are doing.\n')
        shell_command_file.write('\n')
        shell_command_file.write('echo " [*] Adding avatar-cropper to GOPATH. Make sure you ran gen-gopath.py first."\n')
        shell_command_file.write('export GOPATH="{0}"\n'.format(os.environ['GOPATH']))
        shell_command_file.write('echo " [*] avatar-cropper project added to GOPATH."\n')
        shell_command_file.write('echo ""\n')
        shell_command_file.write('echo "New GOPATH (must include path to avatar-cropper subproject):"\n')
        shell_command_file.write('echo "    "$GOPATH\n')
        shell_command_file.close()

        print('done!')
        print('')
        print('DO NOT MODIFY `set-gopath.sh` unless you know what you are doing. To finish properly seting the GOPATH, run `set-gopath.sh`. Make sure you are in the project root. For example:')
        print('')
        print('  $ chmod +x services/avatar-cropper/set-gopath.sh')
        print('  $ (source | .) ./services/avatar-cropper/set-gopath.sh')
        print('')
        print('NOTE: `set-gopath.sh` should NEVER be added to the Git repository. It must be ignored via .gitignore. This is because the path to the `avatar-cropper` project differs from one machine to another. This file is only assured to work in Linux and macOS.')
    # elif host_os == 'nt': # Do Windows equivalent of the UNIX-specific code.
