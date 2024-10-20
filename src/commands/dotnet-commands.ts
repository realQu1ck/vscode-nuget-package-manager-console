export interface DotNetCommand {
    command: string;
    defaultArgs: string[];
    description: string;
    execute: (args?: string[]) => string;
}

export class DotNetCommandManager {
    private commands: DotNetCommand[] = [
        {
            command: 'Install-Package',  // NuGet name
            defaultArgs: ['Newtonsoft.Json'], // Replace with default NuGet package
            description: 'Installs a NuGet package (Install-Package in NuGet Console)',
            execute: (args: string[] = []) => this.runCommand('dotnet add package', args),  // Executes dotnet CLI equivalent
        },
        {
            command: 'Uninstall-Package',  // NuGet name
            defaultArgs: ['Newtonsoft.Json'], // Replace with default package to remove
            description: 'Uninstalls a NuGet package (Uninstall-Package in NuGet Console)',
            execute: (args: string[] = []) => this.runCommand('dotnet remove package', args),  // Executes dotnet CLI equivalent
        },
        {
            command: 'Update-Package',  // NuGet name
            defaultArgs: [],
            description: 'Restores all packages (Update-Package in NuGet Console)',
            execute: (args: string[] = []) => this.runCommand('dotnet restore', args),  // Executes dotnet CLI equivalent
        },
        {
            command: 'Add-Migration',  // NuGet name
            defaultArgs: ['InitialCreate'], // Replace with default migration name
            description: 'Adds a new migration (Add-Migration in NuGet Console)',
            execute: (args: string[] = []) => this.runCommand('dotnet ef migrations add', args),  // Executes dotnet CLI equivalent
        },
        {
            command: 'Update-Database',  // NuGet name
            defaultArgs: [],
            description: 'Updates the database to the latest migration (Update-Database in NuGet Console)',
            execute: (args: string[] = []) => this.runCommand('dotnet ef database update', args),  // Executes dotnet CLI equivalent
        },
        {
            command: 'Remove-Migration',  // NuGet name
            defaultArgs: [],
            description: 'Removes the last migration (Remove-Migration in NuGet Console)',
            execute: (args: string[] = []) => this.runCommand('dotnet ef migrations remove', args),  // Executes dotnet CLI equivalent
        },
        {
            command: 'Get-Package',  // NuGet name
            defaultArgs: [],
            description: 'Lists all installed NuGet packages (Get-Package in NuGet Console)',
            execute: (args: string[] = []) => this.runCommand('dotnet list package', args),  // Executes dotnet CLI equivalent
        },
        {
            command: 'New-Project',  // NuGet name
            defaultArgs: ['console', '--output', 'MyApp'], // Default project template
            description: 'Creates a new project (New-Project in NuGet Console)',
            execute: (args: string[] = []) => this.runCommand('dotnet new', args),  // Executes dotnet CLI equivalent
        },
        {
            command: 'Build',  // NuGet name
            defaultArgs: [],
            description: 'Builds the project (similar to Build command in Visual Studio)',
            execute: (args: string[] = []) => this.runCommand('dotnet build', args),  // Executes dotnet CLI equivalent
        },
        {
            command: 'Run',  // NuGet name
            defaultArgs: [],
            description: 'Runs the project (Run command in Visual Studio)',
            execute: (args: string[] = []) => this.runCommand('dotnet run', args),  // Executes dotnet CLI equivalent
        },
        {
            command: 'Test',  // NuGet name
            defaultArgs: [],
            description: 'Runs the tests (Test command in Visual Studio)',
            execute: (args: string[] = []) => this.runCommand('dotnet test', args),  // Executes dotnet CLI equivalent
        }
    ];

    /**
     * Executes the given dotnet command with optional arguments.
     * @param baseCommand The base dotnet command (e.g., "dotnet new").
     * @param args Optional arguments to append to the command.
     * @returns The formatted command as a string.
     */
    private runCommand(baseCommand: string, args: string[] = []): string {
        const commandToRun = `${baseCommand} ${args.join(' ')}`;
        console.log(`Executing: ${commandToRun}`);
        // Here you'd normally call the real process execution
        // For now, we simulate with a return value.
        return commandToRun;
    }

    /**
     * Retrieves a list of all available commands.
     */
    public getCommands(): DotNetCommand[] {
        return this.commands;
    }

    /**
     * Executes a command by its index in the list.
     * @param index The index of the command in the list.
     * @param args Optional arguments to pass to the command.
     */
    public executeCommandByIndex(index: number, args: string[] = []) {
        if (index >= 0 && index < this.commands.length) {
            const command = this.commands[index];
            return command.execute(args.length > 0 ? args : command.defaultArgs);
        } else {
            throw new Error(`Command at index ${index} not found.`);
        }
    }

    /**
     * Executes a command by its name.
     * @param commandName The name of the command (e.g., "dotnet add package").
     * @param args Optional arguments to pass to the command.
     */
    public executeCommandByName(commandName: string, args: string[] = []) {
        const command = this.commands.find(cmd => cmd.command === commandName);
        if (command) {
            return command.execute(args.length > 0 ? args : command.defaultArgs);
        } else {
            throw new Error(`Command "${commandName}" not found.`);
        }
    }
}
