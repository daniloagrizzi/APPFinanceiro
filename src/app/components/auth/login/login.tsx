const Login = () => {



    return (
        <div className="text-white h-screen flex bg-black">
            <div
                className="h-auto flex justify-center w-[100%] lg:w-[30%] items-center overflow-auto"
            >
                <div className="bg-black w-88 flex flex-col h-auto m-[16px]">

                    <header className="mt-10">
                        <h1 className="font-bold text-[64px] text-center">Wo! Money</h1>
                    </header>
                    <form className="">
                        <div className="mt-10">
                            <label htmlFor="e-mail" className="font-semibold block mb-[8px]">Login</label>
                            <input
                                type="text"
                                id="e-mail"
                                className="border rounded-lg w-full h-12 font-semibold focus:outline-none px-3"
                                placeholder="e-mail ou telefone"
                                required
                            />
                        </div>
                        <div className="mt-[8px]">
                            <label htmlFor="password" className="font-semibold block mb-[8px]"
                            >Senha</label
                            >
                            <input
                                type="password"
                                id="password"
                                className="border rounded-lg w-full h-12 font-semibold focus:outline-none px-3"
                                placeholder="Digite sua senha"
                                required
                            />
                            <div className="mt-[8px]">
                                <a href="#" className="font-semibold">Esqueceu a senha?</a>
                            </div>
                        </div>


                        <div>

                            <button
                                className="w-full font-semibold rounded-full bg-[#221DAF] mt-5 p-3 hover:ring-2 transition durantion-300"
                            >
                                Entrar
                            </button>

                            <a
                                href="#"
                                className="w-full block font-semibold rounded-full mt-3 p-3 ring-2 ring-[#221DAF] text-center hover:ring-white transition durantion-300"
                            >
                                Cadastre-se
                            </a>
                        </div>
                    </form>
                </div>
            </div>

            <div
                className="flex bg-[#221DAF] w-[70%] hidden lg:block justify-center items-center h-screen mt-10"
            >
                <div className="flex justify-center">
                    <img className="h-auto max-w-[412px]" src="/wo-axolot.png" alt="wo! logo" />
                </div>
                <div className="text-center">
                    <h2 className="lg:text-8xl">
                        Olá! <span className="font-bold">Bem vindo!</span>
                    </h2>
                    <p className="text-5xl mt-20">
                        O mais <span className="font-bold">novo</span> e
                        <span className="font-bold">inovador</span> gerenciador de <br />gastos e
                        investimentos!
                    </p>
                </div>
            </div>
        </div>




    )


}

export default Login
