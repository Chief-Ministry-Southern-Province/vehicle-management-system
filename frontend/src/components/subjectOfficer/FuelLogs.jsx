export default function FuelLogs() {
    const logs = [
        ["KAA123A", "42.5 L", "$58.40"],
        ["KAB456B", "30.0 L", "$41.20"],
        ["KAE345E", "55.2 L", "$76.10"],
    ];

    return (
        <div className="bg-white border rounded-2xl p-6">
            <h2 className="font-semibold text-xl mb-5">
                Recent Fuel Logs
            </h2>

            <div className="space-y-4">
                {logs.map((log) => (
                    <div
                        key={log[0]}
                        className="flex justify-between"
                    >
                        <span>{log[0]}</span>
                        <span>{log[1]}</span>
                        <span className="font-semibold">
                            {log[2]}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}